import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from '../../permissions/entities/permissions.entity';
import { User } from '../../users/entities/users.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: false })
  system: boolean;

  @Column({ default: false })
  admin: boolean;

  @Column({ default: false })
  teacher: boolean;

  @Column({ default: false })
  student: boolean;

  @ManyToMany(type => Permission, permission => permission.roles, { cascade: true })
  @JoinTable()
  permissions: Permission[];

  @ManyToMany(type => User, user => user.roles)
  users: User[];
}
