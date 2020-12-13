import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateRoleDto {
  @Field()
  readonly name: string;

  @Field({ defaultValue: false })
  readonly admin: boolean;

  @Field({ defaultValue: false })
  readonly teacher: boolean;

  @Field({ defaultValue: false })
  readonly student: boolean;

  @Field(type => [String], { nullable: true })
  readonly permissionSlugs: string[];
}
