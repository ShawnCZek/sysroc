import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RolesFilter {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  slug?: string;
}
