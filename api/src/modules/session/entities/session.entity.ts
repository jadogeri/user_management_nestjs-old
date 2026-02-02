import { Auth } from "src/modules/auth/entities/auth.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  refreshTokenHash: string; // Hash this for security!

  @Column()
  expiresAt: Date;

  @ManyToOne(() => Auth, (auth) => auth.sessions, { onDelete: 'CASCADE' })
  auth: Auth;
}
