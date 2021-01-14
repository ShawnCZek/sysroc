import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsResolver } from './invitations.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from './entities/invitations.entity';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';
import { MailerModule } from '../mailer/mailer.module';
import { ConfigModule } from '../config/config.module';
import { Project } from '../projects/entities/projects.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation, Project]),
    UsersModule,
    ProjectsModule,
    MailerModule,
    ConfigModule,
  ],
  providers: [InvitationsService, InvitationsResolver],
  exports: [InvitationsService],
})
export class InvitationsModule {}
