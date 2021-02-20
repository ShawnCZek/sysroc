import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectDetailsDto {
  @Field()
  readonly size: number;

  @Field()
  readonly maxSize: number;

  @Field()
  readonly isOwner: boolean;

  @Field()
  readonly isAuthor: boolean;
}
