import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFullRoleDto {
  @Field()
  readonly name: string;

  @Field()
  readonly slug: string;

  @Field()
  readonly system: boolean;

  @Field({ defaultValue: false })
  readonly admin: boolean;

  @Field({ defaultValue: false })
  readonly teacher: boolean;

  @Field({ defaultValue: false })
  readonly student: boolean;

  @Field(type => [String], { nullable: true })
  readonly permissionSlugs: string[];
}
