import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Group } from '../../groups/entities/groups.entity';
import { RoleDto } from '../../roles/dto/role.dto';

@ObjectType()
export class BaseUserDto {
  @Field(type => ID)
  readonly id: number;

  @Field()
  readonly name: string;

  @Field(type => [Group], { defaultValue: undefined })
  readonly groups?: Group[];

  @Field(type => [RoleDto])
  readonly roles: RoleDto[];
}
