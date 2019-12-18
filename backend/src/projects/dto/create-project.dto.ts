import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateProjectDto {
  @Field()
  readonly name: string;
}
