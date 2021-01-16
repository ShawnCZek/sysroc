import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity()
export class PasswordReset {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ManyToOne(type => User)
  user: User;

  @Column()
  hash: string;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  readonly createdAt: Date;
}
