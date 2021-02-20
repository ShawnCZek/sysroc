import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUpload } from 'apollo-server-express';
import { FileUpload } from 'graphql-upload';

@InputType()
export class UploadProjectFilesDto {
  @Field(type => GraphQLUpload, { nullable: true })
  readonly documentation?: Promise<FileUpload>;

  @Field(type => GraphQLUpload, { nullable: true })
  readonly presentation?: Promise<FileUpload>;

  @Field(type => GraphQLUpload, { nullable: true })
  readonly analysis?: Promise<FileUpload>;

  @Field(type => GraphQLUpload, { nullable: true })
  readonly project?: Promise<FileUpload>;
}
