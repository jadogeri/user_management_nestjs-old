import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Role } from './Role'; // Assuming you have a Role entity
import { Resource } from 'src/shared/enums/resource.enum';
import { Action } from 'src/shared/enums/action.enum';

@Entity('permissions')
@Unique(['role', 'resource', 'action']) // Composite unique constraint
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Resource,
  })
  resource: Resource;

  @Column({
    type: 'enum',
    enum: Action,
  })
  action: Action;

  @ManyToOne(() => Role, (role: Role) => role.permissions)
  role: Role;
}
