import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Project } from './entities/projects.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UserDto } from '../users/dto/user.dto';
import { ProjectsFilter } from './filters/project.filter';
import { ProjectDto } from './dto/project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { PERMISSIONS } from '../permissions/permissions';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    user: UserDto,
  ): Promise<ProjectDto> {
    const project = this.projectRepository.create(createProjectDto);
    project.users.push(await this.userRepository.findOne({ id: user.id }));
    const res = await this.projectRepository.save(project);
    return this.projectRepository.findOne(res.id, { relations: ['user', 'supervisor'] });
  }

  async getMany(filter: ProjectsFilter): Promise<ProjectDto[]> {
    const query = this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.users', 'users')
      .leftJoinAndSelect('project.supervisor', 'supervisor')
      .leftJoinAndSelect('project.tasks', 'tasks')
      .addOrderBy('tasks.createdAt');

    if (filter.name && filter.name !== '') {
      query.andWhere('LOWER(project.name) like :name', { name: `%${filter.name}%` });
    }
    if (filter.supervisors && filter.supervisors.length > 0) {
      query.andWhere('supervisor.id IN (:...supervisorIds)', { supervisorIds: filter.supervisors });
    }

    let projects = await query.getMany();

    // // We cannot use the query here, otherwise, the results would be limited as well
    if (filter.authors && filter.authors.length > 0) {
      projects = projects.filter(project => project.users.some(author => filter.authors.includes(author.id)));
    }

    return projects;
  }

  async deleteOne(
    projectId: number,
    user: UserDto,
  ): Promise<ProjectDto> {
    const project = await this.projectRepository.findOne({ id: projectId }, { relations: ['users', 'supervisor'] });
    if (!project) {
      throw new NotFoundException('Project couldn\'t be found.');
    }

    if (!this.isAuthor(project, user) && !this.usersService.hasPermissions(user, PERMISSIONS.PROJECTS_MANAGE)) {
      throw new UnauthorizedException('Missing permissions for deleting this project');
    }

    const res = await this.projectRepository.delete({ id: projectId });
    if (res.affected < 1) {
      throw new InternalServerErrorException('There has been an error during deleting the project.');
    }

    return project;
  }

  async getOne(projectId: number): Promise<ProjectDto> {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.id = :id', { id: projectId })
      .leftJoinAndSelect('project.users', 'users')
      .leftJoinAndSelect('project.supervisor', 'supervisor')
      .leftJoinAndSelect('project.tasks', 'tasks')
      .leftJoinAndSelect('project.classifications', 'classifications')
      .leftJoinAndSelect('classifications.user', 'teacher')
      .orderBy({ 'tasks.createdAt': 'ASC' })
      .getOne();

    if (!project) {
      throw new NotFoundException('Could not find the project!');
    }

    return project;
  }

  async updateOne(
    filter: ProjectsFilter,
    updates: UpdateProjectDto,
    user: UserDto,
  ): Promise<ProjectDto> {
    const project = await this.projectRepository.findOne(filter.id, { relations: ['users', 'supervisor'] });
    if (!project) {
      throw new NotFoundException('Could not find project!');
    }

    if (!this.isAuthor(project, user) && !this.usersService.hasPermissions(user, PERMISSIONS.PROJECTS_MANAGE)) {
      throw new UnauthorizedException('Missing permissions for updating this project');
    }

    const updateProject: Project = {
      ...project,
      name: updates.name,
      description: updates.description,
    };

    if (this.usersService.hasPermissions(user, PERMISSIONS.PROJECTS_CLAIM_MANAGE)) {
      updateProject.supervisor = updates.supervisor ? await this.userRepository.findOne({ id: updates.supervisor }) : null;
    }

    const res = await this.projectRepository.update(filter.id, updateProject);

    if (!res || res.affected < 1) {
      throw new InternalServerErrorException('Could not update the project');
    }

    return this.projectRepository.findOne(filter.id, { relations: ['users', 'supervisor'] });
  }

  async claim(
    filter: ProjectsFilter,
    user: UserDto,
  ): Promise<ProjectDto> {
    const project = await this.projectRepository.findOne(filter.id, { relations: ['users', 'supervisor'] });

    if (!project) {
      throw new NotFoundException('Could not find project!');
    }

    if (project.supervisor && project.supervisor.id !== user.id) {
      throw new UnauthorizedException('You cannot claim this project.');
    }

    project.supervisor = project.supervisor ? null : await this.userRepository.findOne({ id: user.id });
    const res = await this.projectRepository.update(filter.id, project);

    if (!res || res.affected < 1) {
      throw new InternalServerErrorException('Could not claim the project.');
    }

    return this.projectRepository.findOne(filter.id, { relations: ['users', 'supervisor'] });
  }

  isAuthor(
    project: ProjectDto,
    user: UserDto,
  ): boolean {
    return project.users.some(author => author.id === user.id);
  }
}
