import { Module } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { PasswordResetResolver } from './password-reset.resolver';
import { MailerModule } from '../mailer/mailer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '../config/config.module';
import { ThrottlerModule } from 'nestjs-throttler';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordReset]),
    ThrottlerModule.forRoot({}),
    UsersModule,
    MailerModule,
    ConfigModule,
  ],
  providers: [PasswordResetService, PasswordResetResolver],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}
