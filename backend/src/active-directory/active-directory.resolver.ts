import { Args, Query, Resolver } from '@nestjs/graphql';
import { ActiveDirectoryService } from './active-directory.service';
import { ADUser } from './models/ad-user.model';
import { UserAuthInputDto } from '../users/dto/user-auth-input.dto';

@Resolver('ActiveDirectory')
export class ActiveDirectoryResolver {
  constructor(
    private readonly activeDirectoryService: ActiveDirectoryService,
  ) {}

  @Query(() => ADUser)
  authUser(@Args('auth') auth: UserAuthInputDto): Promise<ADUser> {
    return this.activeDirectoryService.authUser(auth);
  }
}
