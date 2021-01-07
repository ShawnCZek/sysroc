import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserDto } from '../../users/dto/user.dto';

@ObjectType()
export class PasswordResetDto {
  @Field(type => ID)
  readonly id: number;

  @Field(type => UserDto)
  readonly user: UserDto;

  @Field()
  readonly hash: string;

  @Field({ defaultValue: false })
  readonly used: boolean;

  @Field(type => Date)
  readonly createdAt: Date;
}
