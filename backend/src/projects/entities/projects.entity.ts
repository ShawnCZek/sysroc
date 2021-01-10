import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Task } from '../../tasks/entities/tasks.entity';
import { Classification } from '../../classification/entities/classification.entity';

@Entity()
@ObjectType()
export class Project {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  readonly id: number;

  @Column({ nullable: false })
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field()
  description: string;

  @ManyToMany(type => User, user => user.projects)
  @Field(type => [User])
  users: User[];

  @ManyToOne(type => User, user => user.supervisedProjects, { nullable: true })
  @Field(type => User)
  supervisor?: User;

  @OneToMany(type => Task, task => task.project)
  @Field(type => [Task])
  tasks: Task[];

  @OneToMany(type => Classification, classification => classification.project)
  @Field(type => [Classification])
  classifications: Classification[];

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  @Field(type => Date)
  readonly createdAt: Date;
}
