import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectDetailsDto {
  @Field()
  readonly isOwner: boolean;

  @Field()
  readonly isAuthor: boolean;
}
