import { forwardRef, Module } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';
import { UploadsResolver } from './uploads.resolver';
import { UploadsService } from './uploads.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './entities/uploads.entity';
import { UploadType } from './dto/upload-type.dto';
import { Project } from '../projects/entities/projects.entity';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Upload, Project]),
    forwardRef(() => ProjectsModule),
    UsersModule,
  ],
  providers: [UploadsResolver, UploadsService],
  exports: [UploadsService],
  controllers: [UploadsController],
})
export class UploadsModule {
  onModuleInit(): void {
    registerEnumType(UploadType, {
      name: 'UploadType',
      description: 'Type of an uploaded file attached to a project.',
      valuesMap: {
        Any: {
          description: 'The default type which is not categorized.',
        },
      },
    });
  }
}
