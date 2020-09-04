import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignUpUserDto {
  @Field({ nullable: true })
  readonly name: string;

  @Field({ nullable: true })
  readonly email: string;

  @Field({ nullable: true })
  readonly password: string;
}
