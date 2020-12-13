import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PermissionDto {
  @Field(type => ID)
  readonly id: number;

  @Field()
  readonly name: string;

  @Field()
  readonly slug: string;
}
