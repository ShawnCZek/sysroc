import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateRoleDto {
  @Field()
  name: string;

  @Field({ defaultValue: false })
  admin: boolean;

  @Field({ defaultValue: false })
  teacher: boolean;

  @Field({ defaultValue: false })
  student: boolean;

  @Field(type => [String], { nullable: true })
  permissionSlugs: string[];
}
