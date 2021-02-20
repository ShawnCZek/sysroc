import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProjectDto } from '../../projects/dto/project.dto';
import { UploadType } from './upload-type.dto';

@ObjectType()
export class UploadDto {
  @Field(type => ID)
  readonly id: number;

  @Field({ defaultValue: '' })
  name?: string;

  @Field()
  readonly token: string;

  @Field()
  readonly mimetype: string;

  @Field()
  readonly size: number;

  @Field(type => UploadType)
  readonly type: UploadType;

  @Field({ defaultValue: '' })
  typeName?: string;

  @Field(() => ProjectDto)
  readonly project: ProjectDto;

  @Field(type => Date)
  readonly createdAt: Date;
}
