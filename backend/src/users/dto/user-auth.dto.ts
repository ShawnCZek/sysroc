import { Field, ObjectType } from '@nestjs/graphql';
import { UserDto } from './user.dto';
import { UserTempDto } from './user-temp.dto';

@ObjectType()
export class UserAuthDto {
  @Field({ nullable: true })
  readonly accessToken?: string;

  @Field({ nullable: true })
  readonly user?: UserDto;

  // Fields that are used when the user is not registered
  @Field({ nullable: true })
  readonly userTemp?: UserTempDto;

  @Field({ nullable: true })
  readonly registerToken?: string;
}
