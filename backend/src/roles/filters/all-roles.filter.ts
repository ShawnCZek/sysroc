import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AllRolesFilter {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  admin?: boolean;

  @Field(type => [String], { nullable: true })
  permissions?: string[];
}
