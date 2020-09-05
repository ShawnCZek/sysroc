import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TasksFilter {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;
}
