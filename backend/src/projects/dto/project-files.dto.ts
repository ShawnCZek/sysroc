import { Field, ObjectType } from '@nestjs/graphql';
import { UploadDto } from '../../uploads/dto/upload.dto';

@ObjectType()
export class ProjectFilesDto {
  @Field(type => UploadDto, { nullable: true })
  readonly documentation?: UploadDto;

  @Field(type => UploadDto, { nullable: true })
  readonly presentation?: UploadDto;

  @Field(type => UploadDto, { nullable: true })
  readonly analysis?: UploadDto;

  @Field(type => UploadDto, { nullable: true })
  readonly project?: UploadDto;
}
