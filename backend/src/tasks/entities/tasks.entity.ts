import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../../projects/entities/projects.entity';

@Entity()
@ObjectType()
export class Task {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  readonly id: number;

  @Column({nullable: false})
  @Field()
  name: string;

  @Column({nullable: true, default: ''})
  @Field()
  description?: string;

  @Column({ type: 'timestamp with time zone', name: 'due_date', nullable: false, default: () => 'now()'})
  @Field(type => Date)
  dueDate: Date;

  @CreateDateColumn({type: 'timestamp with time zone', name: 'created_at'})
  @Field(type => Date)
  createdAt: Date;

  @Column({nullable: false, default: false})
  @Field(type => Boolean)
  completed: boolean;

  @ManyToOne(type => Project, project => project.tasks)
  @Field(type => Project)
  project: Project;

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = new Date();
  }
}
