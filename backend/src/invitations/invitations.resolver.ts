import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from 'nestjs-throttler';
import { InvitationDto } from './dto/invitation.dto';
import { GqlAuthGuard } from '../auth/graphql-auth.guard';
import { InviteDto } from './dto/invite.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDto } from '../users/dto/user.dto';
import { InvitationsService } from './invitations.service';
import { HasPermissions } from '../users/decorators/has-permissions.decorator';
import { PERMISSIONS } from '../permissions/permissions';

@Resolver()
export class InvitationsResolver {
  constructor(
    private readonly invitationsService: InvitationsService,
  ) {}

  @Query(() => [InvitationDto])
  @UseGuards(GqlAuthGuard)
  invitations(
    @Args('projectId') projectId: number,
    @CurrentUser() user: UserDto,
  ): Promise<InvitationDto[]> {
    return this.invitationsService.getManyForProject(projectId, user);
  }

  @Query(() => [InvitationDto])
  @UseGuards(GqlAuthGuard)
  myInvitations(
    @CurrentUser() user: UserDto,
  ): Promise<InvitationDto[]> {
    return this.invitationsService.getMany({ user: user.id });
  }

  @Mutation(() => InvitationDto)
  @UseGuards(GqlAuthGuard, ThrottlerGuard)
  @HasPermissions(PERMISSIONS.PROJECTS_CREATE)
  @Throttle(5, 300)
  invite(
    @Args('input') input: InviteDto,
    @CurrentUser() user: UserDto,
  ): Promise<InvitationDto> {
    return this.invitationsService.create(input, user);
  }

  @Mutation(() => InvitationDto)
  @UseGuards(GqlAuthGuard)
  @HasPermissions(PERMISSIONS.PROJECTS_CREATE)
  acceptInvitation(
    @Args('invitationId') invitationId: number,
    @CurrentUser() user: UserDto,
  ): Promise<InvitationDto> {
    return this.invitationsService.accept(invitationId, user);
  }

  @Mutation(() => InvitationDto)
  @UseGuards(GqlAuthGuard)
  async deleteInvitation(
    @Args('invitationId') invitationId: number,
    @CurrentUser() user: UserDto,
  ): Promise<InvitationDto> {
    const invitation = await this.invitationsService.getOneForUser(invitationId, user);
    return this.invitationsService.deleteOne(invitation);
  }
}
