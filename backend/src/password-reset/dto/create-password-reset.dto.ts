import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePasswordResetDto {
  @Field()
  readonly email: string;
}
