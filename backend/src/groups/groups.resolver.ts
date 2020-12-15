import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/graphql-auth.guard';
import { GroupsService } from './groups.service';
import { GroupsFilter } from './filters/groups.filter';
import { GroupDto } from './dto/group.dto';
import { HasPermissions } from '../users/decorators/has-permissions.decorator';
import { PERMISSIONS } from '../permissions/permissions';

@Resolver('Groups')
export class GroupsResolver {
  constructor(private readonly groupsService: GroupsService) {}

  @Query(() => [GroupDto])
  @UseGuards(GqlAuthGuard)
  groups(
    @Args('filter') filter: GroupsFilter,
  ): Promise<GroupDto[]> {
    return this.groupsService.findAll(filter);
  }

  @Mutation(() => GroupDto)
  @UseGuards(GqlAuthGuard)
  @HasPermissions(PERMISSIONS.GROUP_MANAGE)
  async deleteGroup(
    @Args('groupId') groupId: number,
  ): Promise<GroupDto> {
    const group = await this.groupsService.findOne({ id: groupId });
    return this.groupsService.delete(group);
  }
}
