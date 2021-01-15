import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class InviteDto {
  @Field(type => ID)
  readonly project: number;

  @Field()
  readonly email: string;
}
