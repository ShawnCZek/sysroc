import { BaseUsersFilter } from './base-users.filter';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AllUsersFilter extends BaseUsersFilter {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  adEmail?: string;

  @Field({ nullable: true })
  name?: string;
}
