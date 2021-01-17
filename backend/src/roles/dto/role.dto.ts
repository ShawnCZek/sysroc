import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PermissionDto } from '../../permissions/dto/permission.dto';

@ObjectType()
export class RoleDto {
  @Field(type => ID)
  readonly id: number;

  @Field()
  readonly name: string;

  @Field()
  readonly slug: string;

  @Field()
  readonly system: boolean;

  @Field()
  readonly admin: boolean;

  @Field(type => [PermissionDto])
  readonly permissions: PermissionDto[];
}
