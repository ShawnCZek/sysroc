import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Role } from './entities/roles.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { PermissionsService } from '../permissions/permissions.service';
import { Permission } from '../permissions/entities/permissions.entity';
import { RolesFilter } from './filters/role.filter';
import { AllRolesFilter } from './filters/all-roles.filter';
import { RoleDto } from './dto/role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateFullRoleDto } from './dto/create-full-role.dto';
import { CreatePermissionDto } from '../permissions/dto/create-permission.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly permissionsService: PermissionsService,
  ) {}

  async findOne(filter: RolesFilter): Promise<Role> {
    const query = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .leftJoinAndSelect('role.users', 'users');

    if (filter.id) {
      query.whereInIds(filter.id);
    }
    if (filter.name) {
      query.where('role.name like :name', { name: `%${filter.name}%` });
    }
    if (filter.slug) {
      query.where('role.slug like :slug', { slug: `%${filter.slug}%` });
    }

    const role = await query.getOne();
    if (!role) {
      throw new NotFoundException('Role not found!');
    }

    return role;
  }

  findOneBySlug(slug: string): Promise<Role> {
    return this.findOne({ slug });
  }

  async findAll(filter: AllRolesFilter): Promise<RoleDto[]> {
    const query = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .addOrderBy('role.admin', 'DESC')
      .addOrderBy('role.name', 'ASC');

    if (filter.name) {
      query.where('role.name like :name', { name: `%${filter.name}%` });
    }
    if (filter.slug) {
      query.where('role.slug like :slug', { slug: `%${filter.slug}%` });
    }
    if (filter.admin) {
      query.where('role.admin = true');
    }

    let roles = await query.getMany();

    if (filter.permissions && filter.permissions.length > 0) {
      roles = roles.filter(role => this.hasPermissions(role, ...filter.permissions));
    }

    return roles;
  }

  fetchAll(roleSlugs: string[]): Promise<RoleDto[]> {
    return this.roleRepository.find({
      relations: ['permissions'],
      where: { slug: In(roleSlugs) },
    });
  }

  create(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.createFullRole({
      ...createRoleDto,
      system: false,
      slug: createRoleDto.name.replace(/\s+/g, '-').toLowerCase(),
    });
  }

  /**
   * Create a role using all attributes.
   *
   * @param createFullRoleDto
   */
  async createFullRole(createFullRoleDto: CreateFullRoleDto): Promise<Role> {
    const role = new Role();
    role.name = createFullRoleDto.name;
    role.slug = createFullRoleDto.slug;
    role.system = createFullRoleDto.system;
    role.admin = createFullRoleDto.admin;
    const newRole = await this.roleRepository.save(role);

    return this.updatePermissions(newRole, createFullRoleDto.permissionSlugs);
  }

  async createOrUpdate(createFullRoleDto: CreateFullRoleDto): Promise<Role> {
    try {
      const foundRole = await this.findOneBySlug(createFullRoleDto.slug);
      return this.update(foundRole, createFullRoleDto, true);
    } catch {
      return this.createFullRole(createFullRoleDto);
    }
  }

  async update(
    role: Role,
    updateRole: UpdateRoleDto,
    overridePermissions = false,
  ): Promise<Role> {
    await this.roleRepository.update(role.id, {
      name: updateRole.name,
      admin: updateRole.admin,
    });

    return this.updatePermissions(role, updateRole.permissionSlugs, overridePermissions);
  }

  async updatePermissions(
    role: Role,
    permissions: string[],
    override = false,
  ): Promise<Role> {
    role = await this.roleRepository.findOne(role.id, { relations: ['permissions'] });

    if (override) {
      role.permissions = [];
    }

    const permissionSlugs: CreatePermissionDto[] = permissions.map(permission => ({ slug: permission }));
    const createdPermissions = await this.permissionsService.createMany(permissionSlugs);

    for (const permission of createdPermissions) {
      if (!this.hasPermissions(role, permission.slug)) {
        role.permissions.push(permission);
      }
    }

    await this.roleRepository.save(role);

    return role;
  }

  hasPermissions(
    role: RoleDto,
    ...permissionSlugs: string[]
  ): boolean {
    if (role.admin) {
      return true;
    }

    for (const permissionSlug of permissionSlugs) {
      if (role.permissions.some((rolePermission: Permission) => rolePermission.slug === permissionSlug)) {
        return true;
      }
    }

    return false;
  }

  async deleteRole(role: RoleDto): Promise<RoleDto> {
    const result = await this.roleRepository.delete({ id: role.id });

    if (!result || result.affected < 1) {
      throw new InternalServerErrorException('An error occurred while deleting the role.');
    }

    return role;
  }
}
