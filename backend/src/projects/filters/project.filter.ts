import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProjectsFilter {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field(type => [Number], { nullable: true, defaultValue: [] })
  authors?: number[];

  @Field(type => [Number], { nullable: true, defaultValue: [] })
  supervisors?: number[];
}
