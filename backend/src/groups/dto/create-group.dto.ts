import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateGroupDto {
  @Field()
  readonly name: string;
}
