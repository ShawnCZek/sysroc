import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../roles/entities/roles.entity';

@Entity()
@ObjectType()
export class Permission {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  readonly id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  slug: string;

  @ManyToMany(type => Role, role => role.permissions)
  @Field(type => [Role])
  roles: Role[];
}
