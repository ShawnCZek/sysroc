import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from '../../permissions/entities/permissions.entity';
import { User } from '../../users/entities/users.entity';

@Entity()
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  readonly id: number;

  @Column({ nullable: false })
  @Field()
  name: string;

  @Column({ unique: true })
  @Field()
  slug: string;

  @Column({ default: false })
  @Field()
  system: boolean;

  @Column({ default: false })
  @Field()
  admin: boolean;

  @Column({ default: false })
  @Field()
  teacher: boolean;

  @Column({ default: false })
  @Field()
  student: boolean;

  @ManyToMany(type => Permission, permission => permission.roles, { cascade: true })
  @JoinTable()
  @Field(type => [Permission])
  permissions: Permission[];

  @ManyToMany(type => User, user => user.roles)
  @Field(type => [User])
  users: User[];
}
