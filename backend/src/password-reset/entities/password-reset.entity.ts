import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity()
@ObjectType()
export class PasswordReset {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  readonly id: number;

  @ManyToOne(type => User)
  @Field(type => User)
  user: User;

  @Column()
  @Field()
  hash: string;

  @Column({ default: false })
  @Field()
  used: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  @Field(type => Date)
  readonly createdAt: Date;
}
