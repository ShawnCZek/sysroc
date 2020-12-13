import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Group } from '../../groups/entities/groups.entity';
import { RoleDto } from '../../roles/dto/role.dto';
import { ProjectDto } from '../../projects/dto/project.dto';
import { PermissionStateDto } from './permission-state.dto';

@ObjectType()
export class UserDto {
  @Field(type => ID)
  readonly id: number;

  @Field()
  readonly name: string;

  @Field()
  readonly email: string;

  @Field()
  readonly adEmail: string;

  @Field()
  readonly password?: string;

  @Field(type => [ProjectDto], { defaultValue: undefined })
  readonly projects?: ProjectDto[];

  @Field(type => [Group], { defaultValue: undefined })
  readonly groups?: Group[];

  @Field(type => [RoleDto])
  readonly roles: RoleDto[];

  @Field(type => [PermissionStateDto], { defaultValue: undefined })
  readonly permissions?: PermissionStateDto[];
}
