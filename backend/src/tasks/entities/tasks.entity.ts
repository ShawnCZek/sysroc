import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../../projects/entities/projects.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, default: '' })
  description?: string;

  @Column({ type: 'timestamp with time zone', name: 'due_date', nullable: false, default: () => 'now()' })
  dueDate: Date;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  readonly createdAt: Date;

  @Column({ nullable: false, default: false })
  completed: boolean;

  @ManyToOne(type => Project, project => project.tasks)
  project: Project;
}
