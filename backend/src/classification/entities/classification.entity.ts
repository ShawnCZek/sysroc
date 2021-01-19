import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../../projects/entities/projects.entity';
import { User } from '../../users/entities/users.entity';

@Entity()
export class Classification {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ nullable: false })
  mark: number;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  readonly createdAt: Date;

  @Column({ nullable: false, type: 'int' })
  projectId: number;

  @ManyToOne(type => Project, project => project.classifications, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(type => User, user => user.classifications)
  @JoinColumn({ name: 'userId' })
  user: User;
}
