import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePermissionDto {
  @Field({ nullable: true })
  readonly name?: string;

  @Field()
  readonly slug: string;
}
