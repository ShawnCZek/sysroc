import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../roles/entities/roles.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @ManyToMany(type => Role, role => role.permissions)
  roles: Role[];
}
