import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Project } from './entities/projects.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsFilter } from './filters/project.filter';
import { ProjectDto } from './dto/project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectDetailsDto } from './dto/project-details.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/users.entity';
import { UserDto } from '../users/dto/user.dto';
import { BaseUserDto } from '../users/dto/base-user.dto';
import { UsersService } from '../users/users.service';
import { PERMISSIONS } from '../permissions/permissions';
import { RemoveAuthorDto } from './dto/remove-author.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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
    const owner = await this.userRepository.findOne({ id: user.id });

    const project = this.projectRepository.create(createProjectDto);
    project.owner = owner;
    project.users = [owner];

    const res = await this.projectRepository.save(project);
    return this.projectRepository.findOne(res.id, { relations: ['owner', 'users', 'supervisor'] });
  }

  async getMany(filter: ProjectsFilter): Promise<ProjectDto[]> {
    const query = this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.users', 'users')
      .leftJoinAndSelect('project.supervisor', 'supervisor')
      .leftJoinAndSelect('project.tasks', 'tasks')
      .addOrderBy('tasks.createdAt', 'DESC');

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
    const project = await this.projectRepository.findOne({ id: projectId }, { relations: ['owner', 'users', 'supervisor'] });

    if (!project) {
      throw new NotFoundException('Project couldn\'t be found.');
    }

    if (!this.isAuthor(project, user) && !this.usersService.hasPermissions(user, PERMISSIONS.PROJECTS_MANAGE)) {
      throw new UnauthorizedException('Missing permissions for deleting this project');
    }

    const res = await this.projectRepository.delete({ id: projectId });

    if (!res || res.affected < 1) {
      throw new InternalServerErrorException('There has been an error during deleting the project.');
    }

    return project;
  }

  getOne(projectId: number): Promise<ProjectDto> {
    return this.projectRepository
      .createQueryBuilder('project')
      .where('project.id = :id', { id: projectId })
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.users', 'users')
      .leftJoinAndSelect('project.supervisor', 'supervisor')
      .leftJoinAndSelect('project.tasks', 'tasks')
      .leftJoinAndSelect('project.classifications', 'classifications')
      .leftJoinAndSelect('classifications.user', 'teacher')
      .addOrderBy('tasks.dueDate', 'ASC' )
      .addOrderBy('users.id', 'ASC')
      .getOneOrFail();
  }

  async getDetails(
    projectId: number,
    user: UserDto,
  ): Promise<ProjectDetailsDto> {
    const project = await this.projectRepository.findOne(projectId, { relations: ['owner', 'users'] });

    if (!project) {
      throw new NotFoundException('Could not find the project!');
    }

    return {
      isOwner: this.isOwner(project, user),
      isAuthor: this.isAuthor(project, user),
    };
  }

  async updateOne(
    filter: ProjectsFilter,
    updates: UpdateProjectDto,
    user: UserDto,
  ): Promise<ProjectDto> {
    const project = await this.projectRepository.findOne(filter.id, { relations: ['owner', 'users', 'supervisor'] });
    if (!project) {
      throw new NotFoundException('Could not find project!');
    }

    if (!this.isAuthor(project, user) && !this.usersService.hasPermissions(user, PERMISSIONS.PROJECTS_MANAGE)) {
      throw new UnauthorizedException('Missing permissions for updating this project');
    }

    const updateProject: QueryDeepPartialEntity<Project> = {
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

    return this.projectRepository.findOne(filter.id, { relations: ['owner', 'users', 'supervisor'] });
  }

  async claim(
    filter: ProjectsFilter,
    user: UserDto,
  ): Promise<ProjectDto> {
    const project = await this.projectRepository.findOne(filter.id, { relations: ['supervisor'] });

    if (!project) {
      throw new NotFoundException('Could not find project!');
    }

    if (project.supervisor && project.supervisor.id !== user.id) {
      throw new UnauthorizedException('You cannot claim this project.');
    }

    const res = await this.projectRepository.update(filter.id, { supervisor: project.supervisor ? null : user });

    if (!res || res.affected < 1) {
      throw new InternalServerErrorException('Could not claim the project.');
    }

    return this.projectRepository.findOne(filter.id, { relations: ['owner', 'users', 'supervisor'] });
  }

  async addAuthor(
    project: ProjectDto,
    author: BaseUserDto,
  ): Promise<void> {
    if (!this.usersService.hasPermissions(author, PERMISSIONS.PROJECTS_CREATE)) {
      throw new UnauthorizedException('The user does not have permissions to be a part of a project.');
    }

    const updateProject = { ...project, users: [...project.users, author] };
    await this.projectRepository.save(updateProject);
  }

  async deleteAuthor(
    input: RemoveAuthorDto,
    user: UserDto,
  ): Promise<ProjectDto> {
    const project = await this.projectRepository.findOneOrFail(input.projectId, { relations: ['owner', 'users'] });
    if (!this.isOwner(project, user)) {
      throw new UnauthorizedException('You do not have permissions to manage authors of this project.');
    }

    if (project.owner.id === input.userId) {
      throw new Error('You cannot remove the owner from the project.');
    }

    project.users = project.users.filter(author => author.id !== input.userId);
    return this.projectRepository.save(project);
  }

  isAuthor(
    project: ProjectDto,
    user: BaseUserDto,
  ): boolean {
    return project.users.some(author => author.id === user.id);
  }

  isOwner(
    project: ProjectDto,
    user: BaseUserDto,
  ): boolean {
    return this.isAuthor(project, user) && (project.owner.id === user.id || !this.isAuthor(project, project.owner));
  }
}
