import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UploadsService } from './uploads.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDto } from '../users/dto/user.dto';
import { UploadDto } from './dto/upload.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/graphql-auth.guard';
import { HasPermissions } from '../users/decorators/has-permissions.decorator';
import { PERMISSIONS } from '../permissions/permissions';

@Resolver()
export class UploadsResolver {
  constructor(
    private readonly uploadsService: UploadsService,
  ) {}

  @Mutation(() => UploadDto)
  @UseGuards(GqlAuthGuard)
  @HasPermissions(PERMISSIONS.PROJECTS_CREATE)
  deleteUpload(
    @CurrentUser() user: UserDto,
    @Args('uploadId') uploadId: number,
  ): Promise<UploadDto> {
    return this.uploadsService.deleteOne(uploadId, user);
  }
}
