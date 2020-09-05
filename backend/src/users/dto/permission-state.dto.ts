import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PermissionStateDto {
  @Field()
  readonly slug: string;
  @Field()
  readonly permitted: boolean;
}
