import { Permission } from 'src/modules/permission/entities/permission.entity';
import { UserRole } from 'src/shared/enums/user-role.enum';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    unique: true, // Ensures each role exists only once in the table
  })
  name: UserRole;

  @OneToMany(() => Permission, (permission: Permission) => permission.role)
  permissions: Permission[];
}
