import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InvitationDto } from './dto/invitation.dto';
import { InviteDto } from './dto/invite.dto';
import { UserDto } from '../users/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from './entities/invitations.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { InvitationsFilter } from './filters/invitations.filter';
import { PERMISSIONS } from '../permissions/permissions';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '../config/config.service';
import { ProjectDto } from '../projects/dto/project.dto';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation) private readonly invitationRepository: Repository<Invitation>,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async getOne(invitationId: number): Promise<InvitationDto> {
    const invitation = await this.invitationRepository.findOne(invitationId, {
      relations: ['project', 'project.users', 'invited', 'invited.roles', 'invited.roles.permissions'],
    });

    if (!invitation) {
      throw new NotFoundException();
    }

    return invitation;
  }

  async getOneForUser(
    invitationId: number,
    user: UserDto,
  ): Promise<InvitationDto> {
    const invitation = await this.getOne(invitationId);
    if (invitation.invited.id !== user.id) {
      throw new NotFoundException();
    }

    return invitation;
  }

  getMany(input: InvitationsFilter): Promise<InvitationDto[]> {
    const filter: ObjectLiteral = {};
    if (input.project) filter.project = input.project;
    if (input.user) filter.invited = input.user;

    return this.invitationRepository.find({
      where: filter,
      relations: ['project', 'project.users', 'invited', 'user'],
    });
  }

  async create(
    input: InviteDto,
    user: UserDto,
  ): Promise<InvitationDto> {
    const project = await this.projectsService.getOne(input.project);
    if (!this.projectsService.isAuthor(project, user)) {
      throw new UnauthorizedException('You cannot invite users to this project!');
    }

    const invited = await this.usersService.findOne({ id: input.user });
    if (this.projectsService.isAuthor(project, invited)) {
      throw new Error('This user is already an author of this project!');
    }

    if (!this.usersService.hasPermissions(invited, PERMISSIONS.PROJECTS_CREATE)) {
      throw new Error('This user cannot be invited to projects!');
    }

    const existingInvitation = await this.invitationRepository.findOne({ project, invited });
    if (existingInvitation) {
      throw new Error('This user has already been invited to this project!');
    }

    const createInvitation = this.invitationRepository.create({ project, invited, user });
    await this.invitationRepository.save(createInvitation);

    const invitation = await this.getOne(createInvitation.id);
    // Ignore the promise here so sending an email does not slow down the process
    this.sendInviteEmail(invitation, invitation.project, invited).then(() => {})

    return invitation;
  }

  async accept(
    invitationId: number,
    user: UserDto,
  ): Promise<InvitationDto> {
    const invitation = await this.getOneForUser(invitationId, user);
    await this.projectsService.addAuthor(invitation.project, invitation.invited);
    return this.deleteOne(invitation);
  }

  async deleteOne(invitation: InvitationDto): Promise<InvitationDto> {
    const res = await this.invitationRepository.delete(invitation.id);
    if (res.affected < 1) {
      throw new InternalServerErrorException('There has been an error during deleting the invitation.');
    }

    return invitation;
  }

  private sendInviteEmail(
    invitation: InvitationDto,
    project: ProjectDto,
    user: UserDto,
  ): Promise<any> {
    return this.mailerService.sendMail({
      to: user.email, // As we need to access the user's email here, the base user object cannot be used
      subject: 'Project Invitation',
      template: 'invitation',
      context: {
        name: user.name,
        project: project.name,
        id: invitation.id,
        origin: this.configService.get('APP_URL'),
      },
    });
  }
}
