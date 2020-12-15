import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Role } from './entities/roles.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { PermissionsService } from '../permissions/permissions.service';
import { Permission } from '../permissions/entities/permissions.entity';
import { RolesFilter } from './filters/role.filter';
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

  async findOne(rolesFilter: RolesFilter): Promise<Role> {
    // As the filter is a null prototype and TypeORM has issues with such objects, we need to recreate the filter instance
    const filter = JSON.parse(JSON.stringify(rolesFilter));
    const role = await this.roleRepository.findOne({ relations: ['permissions', 'users'], where: filter });
    if (!role) {
      throw new Error('Role not found!');
    }

    return role;
  }

  findOneBySlug(
    slug: string,
  ): Promise<Role> {
    return this.findOne({ slug });
  }

  findAll(rolesFilter: RolesFilter): Promise<RoleDto[]> {
    // As the filter is a null prototype and TypeORM has issues with such objects, we need to recreate the filter instance
    const filter = JSON.parse(JSON.stringify(rolesFilter));
    return this.roleRepository.find({ relations: ['permissions'], where: filter });
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
    role.teacher = createFullRoleDto.teacher;
    role.student = createFullRoleDto.student;
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
      teacher: updateRole.teacher,
      student: updateRole.student,
    });

    return this.updatePermissions(role, updateRole.permissionSlugs, overridePermissions);
  }

  async updatePermissions(
    role: Role,
    permissions: string[],
    override = false,
  ): Promise<Role> {
    role = await this.roleRepository
      .createQueryBuilder('role')
      .whereInIds(role.id)
      .leftJoinAndSelect('role.permissions', 'permissions')
      .getOne();

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
    role: Role,
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
    if (result.affected < 1) {
      throw new InternalServerErrorException('An error occurred while deleting the role.');
    }

    return role;
  }
}
