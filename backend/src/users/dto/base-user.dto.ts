import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RoleDto } from '../../roles/dto/role.dto';
import { GroupDto } from '../../groups/dto/group.dto';

@ObjectType()
export class BaseUserDto {
  @Field(type => ID)
  readonly id: number;

  @Field()
  readonly name: string;

  @Field(type => [GroupDto], { defaultValue: undefined })
  readonly groups?: GroupDto[];

  @Field(type => [RoleDto])
  readonly roles: RoleDto[];
}
