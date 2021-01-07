import * as crypto from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePasswordResetDto } from './dto/create-password-reset.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '../config/config.service';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordReset) private readonly passwordResetRepository: Repository<PasswordReset>,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async findOne(hash: string): Promise<PasswordResetDto> {
    const passwordReset = await this.passwordResetRepository
      .findOne({ hash }, { relations: ['user'] });

    if (!passwordReset || !this.isPasswordResetValid(passwordReset)) {
      throw new NotFoundException();
    }

    return passwordReset;
  }

  async create(input: CreatePasswordResetDto): Promise<PasswordResetDto | null> {
    try {
      const user = await this.usersService.findOne({ adEmail: input.email });
      const hash = crypto.randomBytes(32).toString('hex');
      await this.passwordResetRepository.save(this.passwordResetRepository.create({ user, hash }));

      const passwordReset = await this.findOne(hash);
      // Ignore the promise here not to slow down the process
      this.sendEmail(passwordReset).then(() => {});
      return passwordReset;
    } catch {
      // No errors must be forwarded back to the user
      return null;
    }
  }

  async changePassword(
    hash: string,
    password: string,
  ): Promise<boolean> {
    const passwordReset = await this.findOne(hash);
    await this.usersService.updatePassword(passwordReset.user, password);
    await this.passwordResetRepository.update(passwordReset.id, { used: true });
    return true;
  }

  isPasswordResetValid(passwordReset: PasswordResetDto): boolean {
    const day = 24 * 60 * 60 * 1000;
    return passwordReset.createdAt.getTime() + day > (new Date()).getTime() && !passwordReset.used;
  }

  private sendEmail(passwordReset: PasswordResetDto): Promise<any> {
    return this.mailerService.sendMail({
      to: passwordReset.user.adEmail,
      subject: 'Password Reset',
      template: 'password',
      context: {
        name: passwordReset.user.name,
        hash: passwordReset.hash,
        origin: this.configService.get('APP_URL'),
      },
    });
  }
}
