import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateTaskDto {
  @Field({ nullable: true })
  readonly name?: string;
  @Field({ nullable: true })
  readonly description?: string;
  @Field({ nullable: true })
  readonly dueDate?: Date;
  @Field({ nullable: true })
  readonly completed?: boolean;
}
