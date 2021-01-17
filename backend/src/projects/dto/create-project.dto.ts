import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProjectDto {
  @Field()
  readonly name: string;

  @Field({ nullable: true })
  readonly description?: string;
}
