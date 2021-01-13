import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProjectDto } from '../../projects/dto/project.dto';
import { BaseUserDto } from '../../users/dto/base-user.dto';

@ObjectType()
export class InvitationDto {
  @Field(type => ID)
  readonly id: number;

  @Field(type => ProjectDto)
  readonly project: ProjectDto;

  @Field(type => BaseUserDto)
  readonly invited: BaseUserDto;

  @Field(type => BaseUserDto)
  readonly user: BaseUserDto;

  @Field(type => Date)
  readonly createdAt: Date;
}
