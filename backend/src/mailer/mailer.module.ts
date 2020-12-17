import { Module } from '@nestjs/common';
import { MailerModule as BaseMailerModule } from '@nestjs-modules/mailer';
import * as mailerconfig from '../mailerconfig';

@Module({
  imports: [
    BaseMailerModule.forRoot(mailerconfig),
  ],
})
export class MailerModule {}
