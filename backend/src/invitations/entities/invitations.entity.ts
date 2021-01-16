import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../../projects/entities/projects.entity';
import { User } from '../../users/entities/users.entity';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ManyToOne(type => Project, project => project.invitations, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  project: Project;

  @ManyToOne(type => User, user => user.invitations, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  invited: User;

  @ManyToOne(type => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  readonly createdAt: Date;
}
