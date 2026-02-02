import { DataSource, Repository as BaseRepository } from 'typeorm';
import { SessionRepositoryInterface } from 'src/shared/interfaces/session-repository.interface';
import { Session } from './entities/session.entity';
import { Auth } from '../auth/entities/auth.entity';
import { Repository } from '../../shared/decorators/repository.decorator';

@Repository()
export class SessionRepository extends BaseRepository<Session> implements SessionRepositoryInterface {
  constructor(private readonly dataSource: DataSource) {
    super(Session, dataSource.createEntityManager());
  }
  findAllByAuth(auth: Auth): Promise<Session[] | null> {
    return this.find({ where: { auth } });
  }
  
}
