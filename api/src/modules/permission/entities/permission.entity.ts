import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, ManyToMany } from 'typeorm';
import { Resource } from 'src/shared/enums/resource.enum';
import { Action } from 'src/shared/enums/action.enum';
import { Role } from 'src/modules/role/entities/role.entity';

@Entity('permissions')
@Unique(['role', 'resource', 'action']) // Composite unique constraint
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Resource,
    default: Resource.AUTH,
  })
  resource: Resource;

  @Column({
    type: 'enum',
    enum: Action,
    default: Action.READ,
  })
  action: Action;

  @ManyToMany(() => Role, (role: Role) => role.permissions)
  roles: Role[];    
}
