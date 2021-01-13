import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class InvitationsFilter {
  @Field(type => ID, { nullable: true })
  project?: number;

  @Field(type => ID, { nullable: true })
  user?: number;
}
