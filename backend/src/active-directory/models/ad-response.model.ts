import { Field, ObjectType } from '@nestjs/graphql';
import { ADUser } from './ad-user.model';

@ObjectType()
export class ADResponse {
  @Field()
  readonly exists: boolean;

  @Field(type => ADUser)
  readonly user: ADUser;
}
