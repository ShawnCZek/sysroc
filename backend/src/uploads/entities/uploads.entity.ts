import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../../projects/entities/projects.entity';
import { UploadType } from '../dto/upload-type.dto';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true })
  path: string;

  @Column({ unique: true, type: 'char', length: 64 })
  token: string;

  @Column()
  mimetype: string;

  @Column({ unsigned: true })
  size: number;

  @Column({ unsigned: true, default: UploadType.Any })
  type: UploadType;

  @ManyToOne(type => Project, project => project.uploads, { onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
  project: Project;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  readonly createdAt: Date;
}
