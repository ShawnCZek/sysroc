import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserDto } from '../../users/dto/user.dto';
import { TaskDto } from '../../tasks/dto/task.dto';
import { ClassificationDto } from '../../classification/dto/classification.dto';
import { UploadDto } from '../../uploads/dto/upload.dto';
import { ProjectFilesDto } from './project-files.dto';

@ObjectType()
export class ProjectDto {
  @Field(type => ID)
  readonly id: number;

  @Field()
  readonly name: string;

  @Field()
  readonly description: string;

  @Field(type => UserDto)
  readonly owner: UserDto;

  @Field(type => [UserDto])
  readonly users: UserDto[];

  @Field(type => UserDto, { nullable: true })
  readonly supervisor?: UserDto;

  @Field(type => [TaskDto], { defaultValue: [] })
  readonly tasks: TaskDto[];

  @Field(type => [ClassificationDto], { defaultValue: [] })
  readonly classifications: ClassificationDto[];

  @Field(type => [UploadDto], { defaultValue: [] })
  readonly uploads: UploadDto[];

  @Field(type => ProjectFilesDto, { nullable: true })
  readonly projectFiles?: ProjectFilesDto;

  @Field(type => Date)
  readonly createdAt: Date;
}
