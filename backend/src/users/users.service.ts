import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PERMISSIONS } from '../permissions/permissions';
import { ROLES } from '../roles/roles';
import {
  ConflictException,
  HttpService,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersFilter } from './filters/users.filter';
import { User } from './entities/users.entity';
import { UserDto } from './dto/user.dto';
import { ConfigService } from '../config/config.service';
import { ADResponse } from '../active-directory/models/ad-response.model';
import { RegisterUserDto } from './dto/register-user.dto';
import { RolesService } from '../roles/roles.service';
import { PermissionStateDto } from './dto/permission-state.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuthInputDto } from './dto/user-auth-input.dto';
import { Role } from '../roles/entities/roles.entity';
import { GroupsService } from '../groups/groups.service';
import { CreateGroupDto } from '../groups/dto/create-group.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AllUsersFilter } from './filters/all-users.filter';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RoleDto } from '../roles/dto/role.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseUsersFilter } from './filters/base-users.filter';
import { BaseUserDto } from './dto/base-user.dto';

@Injectable()
export class UsersService {
  private readonly ADEndpoint: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly groupsService: GroupsService,
    private readonly mailerService: MailerService,
  ) {
    this.ADEndpoint = config.get('AD_ENDPOINT');
  }

  async findAll(filter: AllUsersFilter): Promise<UserDto[]> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.groups', 'groups')
      .addOrderBy('user.name')
      .addOrderBy('groups.name', 'DESC');

    if (filter.name) {
      query.where('LOWER(user.name) LIKE :name', { name: `%${filter.name}%` });
    }
    if (filter.email) {
      query.where('LOWER(user.email) LIKE :email', { email: `%${filter.email}%` });
    }
    if (filter.adEmail) {
      query.where('LOWER(user.adEmail) LIKE :adEmail', { adEmail: `%${filter.adEmail}%` });
    }

    let users = await query.getMany();

    return this.applyAfterQueryFilters(users, filter);
  }

  async findAllBase(filter: BaseUsersFilter): Promise<BaseUserDto[]> {
    let users = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name'])
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.groups', 'groups')
      .addOrderBy('user.name')
      .addOrderBy('groups.name', 'DESC')
      .getMany();

    return this.applyAfterQueryFilters(users, filter);
  }

  async findOne(filter: UsersFilter): Promise<UserDto> {
    // Fix issues with null prototype objects which do not work as filters
    filter = JSON.parse(JSON.stringify(filter));

    const user = await this.userRepository
      .findOne(filter, { relations: ['roles', 'roles.permissions', 'groups', 'projects'] });

    if (!user) {
      throw new Error('User not found!');
    }

    return user;
  }

  async getADUser(
    authInputDto: UserAuthInputDto,
  ): Promise<ADResponse> {
    const { email: username, password } = authInputDto;

    let response: ADResponse = null;
    await this.httpService
      .post(`${this.ADEndpoint}/auth/login`, {
        username,
        password,
      })
      .toPromise()
      .then(res => (response = res.data));

    return response;
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserDto> {
    const groups: CreateGroupDto[] = registerUserDto.dn
      .split(',')
      .map(val => ({ name: val.substring(val.indexOf('=') + 1) }));

    const createdGroups = await this.groupsService.createMany(groups);

    const createUser = {
      email: registerUserDto.email,
      adEmail: registerUserDto.adEmail,
      password: registerUserDto.password,
      name: registerUserDto.name,
      groups: [],
      roles: [],
    };

    createdGroups.forEach(group => {
      createUser.groups.push(group.id);
    });

    let guestRole = null;
    if (!registerUserDto.roleSlugs || registerUserDto.roleSlugs.length === 0) {
      guestRole = await this.rolesService.findOneBySlug(ROLES.GUEST);
      createUser.roles.push(guestRole.id);
    }

    let newUser: User = null;
    try {
      newUser = await this.userRepository.save(this.userRepository.create(createUser));
    } catch {
      throw new Error('Email already in use.');
    }

    for (const group of createdGroups) {
      newUser.groups.push(group);
    }

    if (guestRole) {
      newUser.roles.push(guestRole);
    } else {
      await this.addRoles(newUser, registerUserDto.roleSlugs);
    }

    await this.userRepository.save(newUser);

    // Ignore the promise here so sending the mail does not slow down the process
    this.sendRegisterEmail(newUser).then(() => {});

    return this.userRepository.findOne(newUser.id, { relations: ['roles', 'roles.permissions', 'groups'] });
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<UserDto> {
    if (createUserDto.adEmail && createUserDto.password) {
      let response: ADResponse = null;
      try {
        response = await this.getADUser({
          email: createUserDto.adEmail,
          password: createUserDto.password,
        });
      } catch {
        // Nothing has to be done here
      }

      if (!response || !response.exists) {
        throw new NotFoundException('Incorrect Active Directory email address or password.');
      }

      const adPassword = await this.hashPassword(createUserDto.password);

      return this.register({
        name: createUserDto.name,
        email: createUserDto.email,
        adEmail: createUserDto.adEmail,
        password: adPassword,
        dn: response.user.dn,
        roleSlugs: createUserDto.roleSlugs,
      });
    }

    // Unencrypted password that can be sent to the user via a mail, for example
    const passwordRaw = createUserDto.password ? createUserDto.password : crypto.randomBytes(16).toString('hex');
    const password = await this.hashPassword(passwordRaw);

    const createUser = {
      email: createUserDto.email,
      adEmail: createUserDto.adEmail ? createUserDto.adEmail : createUserDto.email,
      password,
      name: createUserDto.name,
      roles: [],
    };

    let createdUser: User = null;
    try {
      createdUser = await this.userRepository.save(this.userRepository.create(createUser));
    } catch {
      throw new Error('Email already in use.');
    }

    await this.addRoles(createdUser, createUserDto.roleSlugs);
    await this.userRepository.save(createdUser);

    // Ignore the promise here so sending the mail does not slow down the process
    this.sendNewAccountEmail(createdUser, passwordRaw).then(() => {});

    return this.userRepository.findOne(createdUser.id, { relations: ['roles', 'roles.permissions', 'groups'] });
  }

  async update(
    user: UserDto,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    await this.userRepository.update(user.id, {
      name: updateUserDto.name,
      email: updateUserDto.email,
    });

    const updatedUser = await this.userRepository.findOne({ id: user.id }, { relations: ['roles', 'groups'] });

    // Remove all roles
    updatedUser.roles.length = 0;
    // Remove all groups
    updatedUser.groups.length = 0;

    await this.addRoles(updatedUser, updateUserDto.roleSlugs);
    await this.addGroups(updatedUser, updateUserDto.groups);
    await this.userRepository.save(updatedUser);

    return this.userRepository
      .createQueryBuilder('user')
      .whereInIds(updatedUser.id)
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.groups', 'groups')
      .getOne();
  }

  async updateProfile(
    user: UserDto,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserDto> {
    const updateUser: QueryDeepPartialEntity<User> = { name: updateProfileDto.name };

    if (updateProfileDto.email) {
      updateUser.email = updateProfileDto.email;
    }

    if (updateProfileDto.oldPassword && updateProfileDto.password && updateProfileDto.passwordAgain) {
      const valid = await bcrypt.compare(updateProfileDto.oldPassword, user.password);
      if (!valid) {
        throw new UnauthorizedException('The current password does not match.');
      }
      if (updateProfileDto.password !== updateProfileDto.passwordAgain) {
        throw new Error('The new password has not been confirmed.');
      }

      updateUser.password = await this.hashPassword(updateProfileDto.password);
    }

    try {
      await this.userRepository.update(user.id, updateUser);
    } catch {
      throw new ConflictException('This email is already in use!');
    }

    return this.userRepository.findOne({ id: user.id }, { relations: ['roles'] });
  }

  async updatePassword(
    user: UserDto,
    password: string,
  ): Promise<UserDto> {
    password = await this.hashPassword(password);
    await this.userRepository.update(user.id, { password });
    return this.userRepository.findOne({ id: user.id }, { relations: ['roles'] });
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  hasPermissions(
    userDto: UserDto,
    ...permissionSlugs: string[]
  ): boolean {
    if (userDto.roles.length === 0) {
      return false;
    }

    for (const role of userDto.roles) {
      if (this.rolesService.hasPermissions(role as Role, ...permissionSlugs)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Run check on all permissions for the user.
   *
   * @param userDto
   */
  getPermissionStates(userDto: UserDto): PermissionStateDto[] {
    const permissions = [];
    for (const permission of Object.values(PERMISSIONS)) {
      permissions.push({
        slug: permission,
        permitted: this.hasPermissions(userDto, permission),
      });
    }
    return permissions;
  }

  /**
   * Determine whether the user can work with the given roles (e.g. coming from a form).
   *
   * @param userDto
   * @param roles
   */
  canWorkWithRoles(
    userDto: UserDto,
    roles: RoleDto[],
  ): boolean {
    const canManageTeachers = this.hasPermissions(userDto, PERMISSIONS.MANAGE_TEACHER_USERS);
    const canManageStudents = this.hasPermissions(userDto, PERMISSIONS.MANAGE_STUDENT_USERS);

    const manageTeachers = !roles.find(role => role.teacher) || canManageTeachers;
    const manageStudents = !roles.find(role => role.student) || canManageStudents;

    return !roles.find(role => role.admin) && manageTeachers && manageStudents;
  }

  async delete(user: UserDto): Promise<UserDto> {
    const result = await this.userRepository.delete({ id: user.id });

    if (result.affected < 1) {
      throw new InternalServerErrorException('There has been an error while deleting the user.');
    }

    return user;
  }

  private sendNewAccountEmail(
    userDto: UserDto,
    password: string,
  ): Promise<any> {
    return this.mailerService.sendMail({
      to: userDto.email,
      subject: 'New Account',
      template: 'account',
      context: {
        name: userDto.name,
        password,
      },
    });
  }

  private sendRegisterEmail(userDto: UserDto): Promise<any> {
    return this.mailerService.sendMail({
      to: userDto.email,
      subject: 'Welcome to Sysroc',
      template: 'register',
      context: {
        name: userDto.name,
        email: userDto.email,
        adEmail: userDto.adEmail,
      },
    });
  }

  /**
   * Assign new roles to the user.
   *
   * The user entity is **NOT** saved afterwards.
   *
   * @param user
   * @param roleSlugs
   */
  async addRoles(user: User, roleSlugs: string[]): Promise<void> {
    for (const roleSlug of roleSlugs) {
      if (!roleSlug) {
        continue;
      }

      const role = await this.rolesService.findOneBySlug(roleSlug);
      user.roles.push(role);
    }
  }

  /**
   * Assign new groups to the user.
   *
   * The user entity is **NOT** saved afterwards.
   *
   * @param user
   * @param groups
   */
  async addGroups(user: User, groups: number[]): Promise<void> {
    for (const groupId of groups) {
      const group = await this.groupsService.findOne({ id: groupId });
      user.groups.push(group);
    }
  }

  private applyAfterQueryFilters(
    users: User[],
    filter: BaseUsersFilter,
  ): User[] {
    // We cannot use the query here, otherwise, the results would be limited as well.
    // That means that if the user had more groups and one was filtered, the user in
    // the table would be seen as they have only one group
    if (filter.roles && filter.roles.length > 0) {
      users = users.filter(user => user.roles.some(role => filter.roles.includes(role.id)));
    }
    if (filter.rolesSlug && filter.rolesSlug.length > 0) {
      users = users.filter(user => user.roles.some(role => filter.rolesSlug.includes(role.slug)));
    }
    if (filter.groups && filter.groups.length > 0) {
      users = users.filter(user => user.groups.some(group => filter.groups.includes(group.id)));
    }

    const roleAttributes = ['admin', 'teacher', 'student'];
    users = users.filter(user => user.roles.length === 0 || user.roles.some(role => {
      for (const attribute of roleAttributes) {
        if (filter[attribute] !== null && filter[attribute] !== undefined) {
          // The role needs only one of the attributes
          if (filter[attribute] && role[attribute]) {
            return true;
          }
          // The role must not have any of the restricted attributes
          if (!filter[attribute] && role[attribute]) {
            return false;
          }
        }
      }
      return true;
    }));

    return users;
  }
}
