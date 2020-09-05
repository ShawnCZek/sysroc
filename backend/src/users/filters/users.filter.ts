import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UsersFilter {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  adEmail?: string;

  @Field({ nullable: true })
  name?: string;
}
