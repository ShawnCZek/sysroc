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
  @HasPermissions(PERMISSIONS.PROJECTS_VIEW, PERMISSIONS.PROJECTS_CREATE)
  projects(
    @CurrentUser() user: UserDto,
    @Args('filter') filter: ProjectsFilter,
  ): Promise<ProjectDto[]> {
    return this.projectsService.getMany(filter);
  }

  @Query(() => [ProjectDto])
  @UseGuards(GqlAuthGuard)
  myProjects(@CurrentUser() user: UserDto): Promise<ProjectDto[]> {
    return this.projectsService.getMany({ authors: [user.id] });
  }

  @Query(() => ProjectDto)
  @UseGuards(GqlAuthGuard)
  async project(
    @CurrentUser() user: UserDto,
    @Args('filter') filter: ProjectsFilter,
  ): Promise<ProjectDto> {
    const project = await this.projectsService.getOne(filter.id);

    if (!await this.usersService.hasPermissions(user, PERMISSIONS.PROJECTS_VIEW) && !this.projectsService.isAuthor(project, user)) {
      throw new UnauthorizedException('You cannot view this project.');
    }

    return project;
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
}
