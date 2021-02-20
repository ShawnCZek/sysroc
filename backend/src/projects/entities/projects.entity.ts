import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Task } from '../../tasks/entities/tasks.entity';
import { Classification } from '../../classification/entities/classification.entity';
import { Invitation } from '../../invitations/entities/invitations.entity';
import { Upload } from '../../uploads/entities/uploads.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(type => User)
  owner: User;

  @ManyToMany(type => User, user => user.projects)
  users: User[];

  @ManyToOne(type => User, user => user.supervisedProjects, { nullable: true })
  supervisor?: User;

  @OneToMany(type => Task, task => task.project)
  tasks: Task[];

  @OneToMany(type => Classification, classification => classification.project)
  classifications: Classification[];

  @OneToMany(type => Invitation, invitation => invitation.project)
  invitations: Invitation[];

  @OneToMany(type => Upload, upload => upload.project)
  uploads: Upload[];

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  readonly createdAt: Date;
}
