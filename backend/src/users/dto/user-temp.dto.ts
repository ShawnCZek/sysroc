import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserTempDto {
  @Field()
  readonly name: string;

  @Field()
  readonly email: string;
}
