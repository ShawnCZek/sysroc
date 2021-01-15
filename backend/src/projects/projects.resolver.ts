import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { GqlAuthGuard } from '../auth/graphql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDto } from '../users/dto/user.dto';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { ProjectsFilter } from './filters/project.filter';
import { ProjectDto } from './dto/project.dto';
import { HasPermissions } from '../users/decorators/has-permissions.decorator';
import { PERMISSIONS } from '../permissions/permissions';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UsersService } from '../users/users.service';
import { ProjectDetailsDto } from './dto/project-details.dto';
import { RemoveAuthorDto } from './dto/remove-author.dto';

@Resolver('Projects')
export class ProjectsResolver {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => ProjectDto)
  @UseGuards(GqlAuthGuard)
  @HasPermissions(PERMISSIONS.PROJECTS_CREATE)
  createProject(
    @CurrentUser() user: UserDto,
    @Args('input') input: CreateProjectDto,
  ): Promise<ProjectDto> {
    return this.projectsService.create(input, user);
  }

  @Query(() => [ProjectDto])
  @UseGuards(GqlAuthGuard)
  projects(
    @CurrentUser() user: UserDto,
    @Args('filter') filter: ProjectsFilter,
  ): Promise<ProjectDto[]> {
    return this.projectsService.getMany(filter);
  }

  @Query(() => ProjectDto)
  @UseGuards(GqlAuthGuard)
  async project(
    @Args('projectId') projectId: number,
    @CurrentUser() user: UserDto,
  ): Promise<ProjectDto> {
    const project = await this.projectsService.getOne(projectId);

    if (!this.usersService.hasPermissions(user, PERMISSIONS.PROJECTS_VIEW) && !this.projectsService.isAuthor(project, user)) {
      throw new UnauthorizedException('You cannot view this project.');
    }

    return project;
  }

  @Query(() => ProjectDetailsDto)
  @UseGuards(GqlAuthGuard)
  projectDetails(
    @Args('projectId') projectId: number,
    @CurrentUser() user: UserDto,
  ): Promise<ProjectDetailsDto> {
    return this.projectsService.getDetails(projectId, user);
  }

  @Mutation(() => ProjectDto)
  @UseGuards(GqlAuthGuard)
  @HasPermissions(PERMISSIONS.PROJECTS_VIEW)
  updateProject(
    @CurrentUser() user: UserDto,
    @Args('filter') filter: ProjectsFilter,
    @Args('updates') updates: UpdateProjectDto,
  ): Promise<ProjectDto> {
    return this.projectsService.updateOne(filter, updates, user);
  }

  @Mutation(() => ProjectDto)
  @UseGuards(GqlAuthGuard)
  @HasPermissions(PERMISSIONS.PROJECTS_CLAIM)
  claimProject(
    @CurrentUser() user: UserDto,
    @Args('filter') filter: ProjectsFilter,
  ): Promise<ProjectDto> {
    return this.projectsService.claim(filter, user);
  }

  @Mutation(() => ProjectDto)
  @UseGuards(GqlAuthGuard)
  @HasPermissions(PERMISSIONS.PROJECTS_CREATE)
  deleteProject(
    @CurrentUser() user: UserDto,
    @Args('projectId') projectId: number,
  ): Promise<ProjectDto> {
    return this.projectsService.deleteOne(projectId, user);
  }

  @Mutation(() => ProjectDto)
  @UseGuards(GqlAuthGuard)
  @HasPermissions(PERMISSIONS.PROJECTS_CREATE)
  deleteProjectAuthor(
    @Args('input') input: RemoveAuthorDto,
    @CurrentUser() user: UserDto,
  ): Promise<ProjectDto> {
    return this.projectsService.deleteAuthor(input, user);
  }
}
