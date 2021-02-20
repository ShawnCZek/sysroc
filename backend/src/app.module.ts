import { CACHE_MANAGER, CacheModule, Inject, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GroupsModule } from './groups/groups.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
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
import { GraphQLUpload } from 'apollo-server-express';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: 'schema.gql',
        cors: {
          origin: configService.get('APP_URL'),
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          preflightContinue: true,
          optionsSuccessStatus: 204,
          credentials: true,
        },
        resolvers: { Upload: GraphQLUpload },
        installSubscriptionHandlers: true,
        context: ({ req, res }) => ({ req, res }),
      }),
      inject: [ConfigService],
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
    UploadsModule,
  ],
})
export class AppModule {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async onModuleInit(): Promise<void> {
    await this.cacheManager.reset();
  }
}
