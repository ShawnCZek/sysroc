import { Injectable } from '@nestjs/common';
import { Permission } from './entities/permissions.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PermissionDto } from './dto/permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
  ) {}

  findAll(): Promise<PermissionDto[]> {
    return this.permissionRepository.find();
  }

  fetchMany(permissionSlugs: string[]): Promise<PermissionDto[]> {
    return this.permissionRepository.find({
      where: { slug: In(permissionSlugs) },
    });
  }

  async createMany(permissions: CreatePermissionDto[]): Promise<Permission[]> {
    return Promise.all(
      permissions.map(async (permission: CreatePermissionDto) => {
        const filter = { slug: permission.slug };
        const foundPermission = await this.permissionRepository.findOne(filter);
        if (!foundPermission) {
          let alternativeName = permission.slug.split('.').reverse().join(' ');
          alternativeName = alternativeName.charAt(0).toUpperCase() + alternativeName.substr(1);
          return this.permissionRepository.create({
            name: permission.name ? permission.name : alternativeName,
            slug: permission.slug,
            roles: [],
          });
        }
        return foundPermission;
      }),
    );
  }
}
