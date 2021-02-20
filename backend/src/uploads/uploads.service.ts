import * as fs from 'fs';
import * as crypto from 'crypto';
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/uploads.entity';
import { Repository } from 'typeorm';
import { FileUpload } from 'graphql-upload';
import { ProjectDto } from '../projects/dto/project.dto';
import { UploadDto } from './dto/upload.dto';
import { UploadType } from './dto/upload-type.dto';
import { UserDto } from '../users/dto/user.dto';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { Project } from '../projects/entities/projects.entity';
import { PERMISSIONS } from '../permissions/permissions';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload) private readonly uploadRepository: Repository<Upload>,
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    @Inject(forwardRef(() => ProjectsService))
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) {}

  async getUpload(id: number): Promise<Upload> {
    const upload = await this.uploadRepository.findOne(id, { relations: ['project', 'project.users'] });
    if (!upload) {
      throw new NotFoundException('Could not find the uploaded file.');
    }

    return upload;
  }

  getOne(token: string): Promise<Upload> {
    return this.uploadRepository
      .findOneOrFail({ where: { token }, relations: ['project'] })
      .catch(() => { throw new NotFoundException('Could not find the uploaded file.'); });
  }

  toUploadDto(
    upload: Upload,
    project?: ProjectDto,
  ): UploadDto {
    const uploadDto: UploadDto = upload;

    const pathParts = upload.path.split('/');
    const extensions = pathParts[pathParts.length - 1].split('.');
    let typeName = extensions[0];
    if (upload.type === UploadType.Documentation) {
      typeName = 'Documentation';
    } else if (upload.type === UploadType.Presentation) {
      typeName = 'Presentation';
    } else if (upload.type === UploadType.Analysis) {
      typeName = 'Analysis';
    } else if (upload.type === UploadType.Project) {
      typeName = 'Project';
    }

    uploadDto.typeName = typeName;
    uploadDto.name = `${typeName}_${project?.name || upload.project.name}_${upload.createdAt.getTime()}.${extensions[extensions.length - 1]}`;

    return uploadDto;
  }

  async getProjectSize(projectId: number): Promise<number> {
    const { sum } = await this.uploadRepository
      .createQueryBuilder('upload')
      .select('SUM(upload.size)', 'sum')
      .where('upload.projectId = :projectId', { projectId })
      .getRawOne();

    return sum ? parseInt(sum) : 0;
  }

  async createFile(
    file: FileUpload,
    type: UploadType,
    project: ProjectDto,
  ): Promise<UploadDto> {
    const totalSize = await this.getProjectSize(project.id);
    if (totalSize >= this.getMaxProjectSize()) {
      throw new Error('This project has already exceeded the maximum size!');
    }

    const extensions = file.filename.split('.');
    const extension = extensions.length > 1 ? extensions[extensions.length - 1] : 'unknown';
    const path = `./uploads/projects/${project.id}/${this.generateFileName()}.${extension}`;
    const result = await this.uploadFile(file, path);
    if (!result) {
      throw new InternalServerErrorException('Cannot upload the file!');
    }

    const stats = fs.statSync(path);
    const size = stats.size;
    if (totalSize + size > this.getMaxProjectSize()) {
      this.deleteFile(path);
      throw new Error('This file exceeds the maximum size of a project!');
    }

    const token = this.generateToken();
    const mimetype = file.mimetype;

    const upload = this.uploadRepository.create({ path, type, size, project, token, mimetype });
    const res = await this.uploadRepository.save(upload);

    return this.getUpload(res.id).then(upload => this.toUploadDto(upload, project));
  }

  async deleteOne(
    uploadId: number,
    user: UserDto,
  ): Promise<UploadDto> {
    const upload = await this.getUpload(uploadId);
    if (!this.projectsService.isAuthor(upload.project, user) && !this.usersService.hasPermissions(user, PERMISSIONS.PROJECTS_MANAGE)) {
      throw new UnauthorizedException('Missing permissions for deleting attachments of this project.');
    }

    try {
      this.deleteFile(upload.path);
    } catch {
      console.warn(`[upload] The file "${upload.path}" seems to be already deleted.`);
    }

    const res = await this.uploadRepository.delete(uploadId);
    if (!res || res.affected < 1) {
      throw new InternalServerErrorException('An error occurred while deleting the project attachment.');
    }

    const updatedProject = await this.projectRepository.findOne(upload.project.id, { relations: ['uploads'] });
    return {
      ...this.toUploadDto(upload),
      project: this.projectsService.toProjectDto(updatedProject),
    };
  }

  async deleteMany(
    projectId: number,
    user: UserDto,
  ): Promise<void> {
    const project = await this.projectRepository.findOne(projectId, { relations: ['owner', 'users'] });
    if (!project) {
      throw new NotFoundException('Could not find project!');
    }

    if (!this.projectsService.isAuthor(project, user) && !this.usersService.hasPermissions(user, PERMISSIONS.PROJECTS_MANAGE)) {
      throw new UnauthorizedException('Missing permissions for managing attachments of this project');
    }

    fs.rmdirSync(`./uploads/projects/${project.id}`);
    await this.uploadRepository.delete({ project });
  }

  download(upload: Upload): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      fs.readFile(upload.path, {}, (err, data: Buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  protected uploadFile(
    file: FileUpload,
    path: string,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      // The folder must be created first
      fs.mkdirSync(path.substr(0, path.lastIndexOf('/')), { recursive: true });

      return file.createReadStream()
        .pipe(fs.createWriteStream(path))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false));
    });
  }

  protected deleteFile(path: string): void {
    fs.rmSync(path);
  }

  protected generateFileName(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  protected generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  getMaxProjectSize(): number {
    return 50 * 1024 * 1024; // 50 MB
  }
}
