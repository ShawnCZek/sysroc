import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateRoleDto {
  @Field()
  name: string;

  @Field({ defaultValue: false })
  admin: boolean;

  @Field(type => [String], { nullable: true })
  permissionSlugs: string[];
}
