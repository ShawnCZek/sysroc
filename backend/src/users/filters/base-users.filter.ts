import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BaseUsersFilter {
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
