import { CACHE_MANAGER, CacheModule, Inject, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GroupsModule } from './groups/groups.module';
import { ConfigModule } from './config/config.module';
import { ActiveDirectoryModule } from './active-directory/active-directory.module';
import { UsersModule } from './users/users.module';
import { Cache } from 'cache-manager';
import { ProjectsModule } from './projects/projects.module';
import { PermissionsModule } from './permissions/permissions.module';
import { TasksModule } from './tasks/tasks.module';
import { DatabaseModule } from './database/database.module';
import { ClassificationModule } from './classification/classification.module';
import { MailerModule } from './mailer/mailer.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { InvitationsModule } from './invitations/invitations.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      cors: {
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: true,
        optionsSuccessStatus: 204,
        credentials: true,
      },
      installSubscriptionHandlers: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    CacheModule.register(),
    GroupsModule,
    ConfigModule,
    PermissionsModule,
    ActiveDirectoryModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
    DatabaseModule,
    MailerModule,
    ClassificationModule,
    PasswordResetModule,
    InvitationsModule,
  ],
})
export class AppModule {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async onModuleInit(): Promise<void> {
    await this.cacheManager.reset();
  }
}
