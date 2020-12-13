import { Query, Resolver } from '@nestjs/graphql';
import { PermissionsService } from './permissions.service';
import { PermissionDto } from './dto/permission.dto';

@Resolver('Permissions')
export class PermissionsResolver {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Query(() => [PermissionDto])
  permissions(): Promise<PermissionDto[]> {
    return this.permissionsService.findAll();
  }
}
