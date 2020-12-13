import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersFilter } from './filters/users.filter';
import { GqlAuthGuard } from '../auth/graphql-auth.guard';
import { ConflictException, HttpService, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserAuthDto } from './dto/user-auth.dto';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MyContext } from '../context';
import { jwtConstants } from '../auth/constants';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { ConfigService } from '../config/config.service';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { redisConstants } from '../redis/constants';
import { User } from './entities/users.entity';
import { HasPermissions } from './decorators/has-permissions.decorator';
import { PERMISSIONS } from '../permissions/permissions';
import { RolesService } from '../roles/roles.service';
import { UserAuthInputDto } from './dto/user-auth-input.dto';
import { ADResponse } from '../active-directory/models/ad-response.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { AllUsersFilter } from './filters/all-users.filter';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PermissionStateDto } from './dto/permission-state.dto';

@Resolver()
export class UsersResolver {
  private ADEndpoint: string;
  private redisClient: Redis;

  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.ADEndpoint = config.get('AD_ENDPOINT');
    this.redisClient = redisService.getClient(redisConstants.name);
  }

  @Query(() => UserDto)
  @UseGuards(GqlAuthGuard)
  user(@Args('filter') filter: UsersFilter) {
    return this.usersService.findOne(filter);
  }

  @Query(() => [UserDto])
  @UseGuards(GqlAuthGuard)
  users(@Args('filter') filter: AllUsersFilter) {
    return this.usersService.findAll(filter);
  }

  @Query(() => UserAuthDto, { nullable: true })
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: User): UserAuthDto {
    return { user };
  }

  @Query(() => [PermissionStateDto])
  @UseGuards(GqlAuthGuard)
  myPermissions(@CurrentUser() user: User): PermissionStateDto[] {
    return this.usersService.getPermissionStates(user);
  }

  @Mutation(() => UserDto)
  @UseGuards(GqlAuthGuard)
  @HasPermissions(PERMISSIONS.MANAGE_STUDENT_USERS, PERMISSIONS.MANAGE_TEACHER_USERS)
  async createUser(
    @CurrentUser() user: User,
    @Args('input') input: CreateUserDto,
  ) {
    const roles = await this.rolesService.fetchAll(input.roleSlugs);
    if (!this.usersService.canWorkWithRoles(user, roles)) {
      throw new UnauthorizedException('You cannot create a user account with the role.');
    }

    return this.usersService.create(input);
  }

  @Mutation(() => UserAuthDto)
  async signup(
    @Args('input') input: SignUpUserDto,
    @Context() { res, req }: MyContext,
  ) {
    const cookies = req.cookies;
    if (!cookies['register-token']) {
      throw new UnauthorizedException('No or expired token for registration.');
    }

    const registerToken = cookies['register-token'];
    const registerUserDto: RegisterUserDto = JSON.parse(
      await this.redisClient.get(registerToken),
    );
    if (registerUserDto === undefined) {
      throw new UnauthorizedException('No or expired token for registration.');
    }

    let name = registerUserDto.name;
    let email = registerUserDto.adEmail;
    let password = registerUserDto.password;
    if (input.name !== '') {
      name = input.name;
    }
    if (input.email !== '') {
      email = input.email;
    }
    if (input.password !== '') {
      password = await this.usersService.hashPassword(input.password);
    }

    const user = await this.usersService.register({
      email,
      adEmail: registerUserDto.adEmail,
      name,
      password,
      dn: registerUserDto.dn,
    });
    const permissions = await this.usersService.getPermissionStates(user);

    // We need to fetch the registered user again to get the ID
    const registeredUser = await this.usersService.findOne({
      adEmail: user.adEmail,
    });

    const token = await this.authService.createToken(
      registeredUser.adEmail,
      registeredUser.id,
    );

    await this.redisClient.del(registerToken);

    const refreshToken = await this.authService.createRefreshToken(
      registeredUser.adEmail,
      registeredUser.id,
    );

    res.cookie('token', refreshToken, {
      httpOnly: true,
      path: jwtConstants.refreshPath,
    });

    return {
      accessToken: token,
      user,
      permissions,
      userTemp: null,
      registerToken: null,
    };
  }

  @Mutation(() => UserAuthDto)
  async signin(
    @Args('auth') auth: UserAuthInputDto,
    @Context() { res }: MyContext,
  ): Promise<UserAuthDto> {
    let user: UserDto = null;
    try {
      user = await this.usersService
        .findOne({ email: auth.email });
    } catch {
      // Nothing has to be done here
    }

    if (user) {
      const valid = await bcrypt.compare(auth.password, user.password);
      if (!valid) {
        throw new UnauthorizedException('Wrong password or email!');
      }

      const token = await this.authService.createToken(user.adEmail, user.id);
      const refreshToken = await this.authService.createRefreshToken(
        user.adEmail,
        user.id,
      );

      res.cookie('token', refreshToken, {
        httpOnly: true,
        path: jwtConstants.refreshPath,
      });

      return {
        accessToken: token,
        user,
        userTemp: null,
        registerToken: null,
      };
    }

    let userWithADEmail: UserDto = null;
    try {
      userWithADEmail = await this.usersService
        .findOne({ adEmail: auth.email });
    } catch {
      // Nothing has to be done here
    }
    if (userWithADEmail) {
      throw new ConflictException(
        'This email has already been registered. Have you forgotten your customized email?',
      );
    }

    let response: ADResponse = null;
    try {
      response = await this.usersService.getADUser(auth);
    } catch {
      // Nothing has to be done here
    }
    if (!response || !response.exists) {
      throw new UnauthorizedException('Wrong password or email!');
    }

    const password = await this.usersService.hashPassword(auth.password);
    const registerToken = crypto.randomBytes(32).toString('hex');

    res.cookie('register-token', registerToken, {
      httpOnly: true,
      path: '/',
      maxAge: 5 * 60 * 1000,
    });

    const registerUserDto: RegisterUserDto = {
      email: auth.email,
      adEmail: auth.email,
      name: response.user.cn,
      password,
      dn: response.user.dn,
    };

    await this.redisClient.append(
      registerToken,
      JSON.stringify(registerUserDto),
    );

    return {
      accessToken: null,
      user: null,
      userTemp: {
        email: auth.email,
        name: response.user.cn,
      },
      registerToken,
    };
  }

  @Mutation(() => UserDto)
  @UseGuards(GqlAuthGuard)
  @HasPermissions(PERMISSIONS.MANAGE_STUDENT_USERS, PERMISSIONS.MANAGE_TEACHER_USERS)
  async updateUser(
    @CurrentUser() user: User,
    @Args('filter') filter: UsersFilter,
    @Args('input') input: UpdateUserDto,
  ) {
    // The user that is supposed to be updated
    const userDto = await this.usersService.findOne(filter);

    const roles = await this.rolesService.fetchAll(input.roleSlugs);
    if (!this.usersService.canWorkWithRoles(user, userDto.roles)) {
      throw new UnauthorizedException('You cannot manage this user.');
    }
    if (!this.usersService.canWorkWithRoles(user, roles)) {
      throw new UnauthorizedException('You cannot assign one of the selected roles to the user.');
    }

    return this.usersService.update(userDto, input);
  }

  @Mutation(() => UserAuthDto)
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @CurrentUser() user: User,
    @Args('input') input: UpdateProfileDto,
  ): Promise<UserAuthDto> {
    const updatedUser = await this.usersService.updateProfile(user, input);
    return { user: updatedUser };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(@Context() { res }: MyContext): Promise<boolean> {
    res.cookie('token', '', {
      httpOnly: true,
      path: jwtConstants.refreshPath,
    });

    return true;
  }

  @Mutation(() => UserDto)
  @UseGuards(GqlAuthGuard)
  @HasPermissions(PERMISSIONS.DELETE_USERS)
  async deleteUser(
    @CurrentUser() user: User,
    @Args('userId') userId: number,
  ): Promise<UserDto> {
    // The current user cannot delete itself
    if (user.id === userId) {
      throw new UnauthorizedException('You cannot delete yourself!');
    }

    const userToDelete = await this.usersService.findOne({ id: userId });
    if (!this.usersService.canWorkWithRoles(user, userToDelete.roles)) {
      throw new UnauthorizedException('You cannot delete this user account!');
    }

    return this.usersService.delete(userToDelete);
  }
}
