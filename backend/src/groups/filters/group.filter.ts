import { Field, InputType } from '@nestjs/graphql';

export type GroupSort = 'name_asc' | 'name_desc' | 'users_asc' | 'users_desc';

@InputType()
export class GroupFilter {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  order?: GroupSort;
}
