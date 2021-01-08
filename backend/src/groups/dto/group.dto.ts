import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserDto } from '../../users/dto/user.dto';

@ObjectType()
export class GroupDto {
  @Field(type => ID)
  readonly id: number;

  @Field()
  readonly name: string;

  @Field(type => [UserDto], { defaultValue: [] })
  readonly users: UserDto[];

  @Field({ nullable: true })
  readonly usersCount?: number;
}
