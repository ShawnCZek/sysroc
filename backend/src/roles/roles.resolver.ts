import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { RoleDto } from './dto/role.dto';
import { RolesFilter } from './filters/role.filter';
import { AllRolesFilter } from './filters/all-roles.filter';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/graphql-auth.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { AdminGuard } from '../users/guards/admin.guard';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionsService } from '../permissions/permissions.service';

@Resolver('Roles')
export class RolesResolver {
  constructor(
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
  ) {}

  @Query(() => [RoleDto])
  roles(
    @Args('filter') filter: AllRolesFilter,
  ): Promise<RoleDto[]> {
    return this.rolesService.findAll(filter);
  }

  @Mutation(() => RoleDto)
  @UseGuards(GqlAuthGuard, AdminGuard)
  async createRole(
    @Args('input') input: CreateRoleDto,
  ): Promise<RoleDto> {
    // Filter roles
    if (input.permissionSlugs.length > 0) {
      const permissions = await this.permissionsService.fetchMany(input.permissionSlugs);
      input.permissionSlugs = permissions.map(permission => permission.slug);
    }

    return this.rolesService.create(input);
  }

  @Mutation(() => RoleDto)
  @UseGuards(GqlAuthGuard, AdminGuard)
  async updateRole(
    @Args('filter') filter: RolesFilter,
    @Args('input') input: UpdateRoleDto,
  ): Promise<RoleDto> {
    const role = await this.rolesService.findOne(filter);
    if (role.admin) {
      input.permissionSlugs = [];
    }

    // Filter roles
    if (input.permissionSlugs.length > 0) {
      const permissions = await this.permissionsService.fetchMany(input.permissionSlugs);
      input.permissionSlugs = permissions.map(permission => permission.slug);
    }

    // Override values that the user cannot modify
    input.admin = role.admin;

    return this.rolesService.update(role, input, true);
  }

  @Mutation(() => RoleDto)
  @UseGuards(GqlAuthGuard, AdminGuard)
  async deleteRole(
    @Args('roleId') roleId: number,
  ): Promise<RoleDto> {
    const role = await this.rolesService.findOne({ id: roleId });

    if (role.admin || role.system) {
      throw new UnauthorizedException('You cannot manage this role.');
    }

    return this.rolesService.deleteRole(role);
  }
}
