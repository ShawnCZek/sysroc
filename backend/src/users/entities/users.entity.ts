import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../roles/entities/roles.entity';
import { Group } from '../../groups/entities/groups.entity';
import { Project } from '../../projects/entities/projects.entity';
import { Classification } from '../../classification/entities/classification.entity';
import { Invitation } from '../../invitations/entities/invitations.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, unique: true })
  adEmail: string;

  @ManyToMany(type => Role, role => role.users, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinTable()
  roles: Role[];

  @ManyToMany(type => Group, group => group.users, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinTable()
  groups: Group[];

  @ManyToMany(type => Project, project => project.users, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinTable()
  projects: Project[];

  @OneToMany(type => Classification, classification => classification.user)
  classifications: Classification[];

  @OneToMany(type => Project, project => project.supervisor)
  supervisedProjects: Project[];

  @OneToMany(type => Invitation, invitation => invitation.invited)
  invitations: Invitation[];
}
