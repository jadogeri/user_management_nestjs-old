// src/user/user.repository.ts
import { Repository as BaseRepository, EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
import { Repository } from '../../shared/decorators/repository.decorator';

@Repository()
export class UserRepository extends BaseRepository<User> {
  constructor(private readonly entityManager: EntityManager) {
    super(User, entityManager);
  }

  async findByUsername(username: string): Promise<User | null> {    
    return await this.findOne({ where: { firstName: username } }); // Custom method
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ where: { email } }); // Custom method
  }
}
