import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  name: string;

  @ManyToMany(type => User, user => user.groups)
  users: User[];

  usersCount: number;
}
