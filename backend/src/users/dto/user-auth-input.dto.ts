import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserAuthInputDto {
  @Field()
  readonly email: string;

  @Field()
  readonly password: string;
}
