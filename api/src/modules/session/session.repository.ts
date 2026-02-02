// user.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserRepositoryInterface } from 'src/shared/interfaces/user-repository.interface';
import { SessionRepositoryInterface } from 'src/shared/interfaces/session-repository.interface';
import { Session } from './entities/session.entity';
import { Auth } from '../auth/entities/auth.entity';
@Injectable()
export class SessionRepository extends Repository<Session> implements SessionRepositoryInterface {
  constructor(private readonly dataSource: DataSource) {
    super(Session, dataSource.createEntityManager());
  }
  findAllByAuth(auth: Auth): Promise<Session[] | null> {
    return this.find({ where: { auth } });
  }
  
}
