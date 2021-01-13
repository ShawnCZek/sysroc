import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Project } from '../../projects/entities/projects.entity';
import { User } from '../../users/entities/users.entity';

@Entity()
@ObjectType()
export class Invitation {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  readonly id: number;

  @ManyToOne(type => Project, project => project.invitations, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @Field(type => Project)
  project: Project;

  @ManyToOne(type => User, user => user.invitations, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @Field(type => User)
  invited: User;

  @ManyToOne(type => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @Field(type => User)
  user: User;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  @Field(type => Date)
  readonly createdAt: Date;
}
