import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateProjectDto {
  @Field({ nullable: true })
  readonly name?: string;

  @Field({ nullable: true })
  readonly description?: string;

  @Field({ nullable: true })
  readonly supervisor?: number;
}
