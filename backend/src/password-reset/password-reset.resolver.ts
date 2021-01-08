import { Throttle, ThrottlerGuard } from 'nestjs-throttler';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PasswordResetService } from './password-reset.service';
import { CreatePasswordResetDto } from './dto/create-password-reset.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { UseGuards } from '@nestjs/common';
import { GuestGuard } from '../users/guards/guest.guard';

@Resolver()
export class PasswordResetResolver {
  constructor(
    private readonly passwordResetService: PasswordResetService,
  ) {}

  @Query(() => PasswordResetDto)
  @UseGuards(GuestGuard, ThrottlerGuard)
  @Throttle(5, 300)
  passwordReset(
    @Args('hash') hash: string,
  ): Promise<PasswordResetDto> {
    return this.passwordResetService.findOne(hash);
  }

  @Mutation(() => Boolean)
  @UseGuards(GuestGuard, ThrottlerGuard)
  @Throttle(3, 300)
  async createPasswordReset(
    @Args('input') input: CreatePasswordResetDto,
  ): Promise<boolean> {
    return this.passwordResetService.create(input).then(() => true);
  }

  @Mutation(() => Boolean)
  @UseGuards(GuestGuard, ThrottlerGuard)
  @Throttle(3, 300)
  changePassword(
    @Args('hash') hash: string,
    @Args('password') password: string,
  ): Promise<boolean> {
    return this.passwordResetService.changePassword(hash, password);
  }
}
