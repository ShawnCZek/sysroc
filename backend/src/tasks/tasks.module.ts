import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/tasks.entity';
import { Project } from '../projects/entities/projects.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Project]),
    ProjectsModule,
    UsersModule,
  ],
  providers: [TasksResolver, TasksService],
})
export class TasksModule {}
