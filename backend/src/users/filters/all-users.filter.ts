import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AllUsersFilter {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  adEmail?: string;

  @Field({ nullable: true })
  name?: string;

  @Field(type => [Number], { nullable: true })
  roles?: number[];

  @Field(type => [String], { nullable: true })
  rolesSlug?: string[];

  @Field({ nullable: true })
  admin?: boolean;

  @Field({ nullable: true })
  teacher?: boolean;

  @Field({ nullable: true })
  student?: boolean;

  @Field(type => [Number], { nullable: true })
  groups?: number[];
}
