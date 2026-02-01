import { Permission } from 'src/modules/permission/entities/permission.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { UserRole } from 'src/shared/enums/user-role.enum';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';


@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserRole, unique: true })
  name: UserRole;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  // Many users can have this role
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, (permission: Permission) => permission.roles)
  @JoinTable({ name: 'roles_permissions' }) // TypeORM creates this junction table
  permissions: Permission[];    
}
