import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveAuthorDto {
  @Field()
  readonly projectId: number;

  @Field()
  readonly userId: number;
}
