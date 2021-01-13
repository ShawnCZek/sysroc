import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../roles/entities/roles.entity';
import { Group } from '../../groups/entities/groups.entity';
import { Project } from '../../projects/entities/projects.entity';
import { Classification } from '../../classification/entities/classification.entity';
import { Invitation } from '../../invitations/entities/invitations.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  readonly id: number;

  @Column({ nullable: false })
  @Field()
  name: string;

  @Column({ nullable: false })
  @Field()
  password: string;

  @Column({ nullable: false, unique: true })
  @Field()
  email: string;

  @Column({ nullable: false, unique: true })
  @Field()
  adEmail: string;

  @ManyToMany(type => Role, role => role.users, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinTable()
  @Field(type => [Role])
  roles: Role[];

  @ManyToMany(type => Group, group => group.users, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinTable()
  @Field(type => [Group])
  groups: Group[];

  @ManyToMany(type => Project, project => project.users, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinTable()
  @Field(type => [Project])
  projects: Project[];

  @OneToMany(type => Classification, classification => classification.user)
  @Field(type => [Classification])
  classifications: Classification[];

  @OneToMany(type => Project, project => project.supervisor)
  @Field(type => [Project])
  supervisedProjects: Project[];

  @OneToMany(type => Invitation, invitation => invitation.invited)
  @Field(type => [Invitation])
  invitations: Invitation[];
}
