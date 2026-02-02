import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Service } from 'src/shared/decorators/service.decorator';
import { SessionRepository } from './session.repository';
import { Session } from './entities/session.entity';

@Service()
export class SessionService {

  constructor(
    private readonly sessionRepository: SessionRepository,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session | null> {
    // Uses the custom repository to create and save a new entity
    return await this.sessionRepository.save(createSessionDto);
  }

  async findAll(): Promise<Session[] | null> {
    // Returns all records from the session table
    return await this.sessionRepository.find();
  }

  async findOne(id: string) : Promise<Session | null> {
    // Finds a specific session by its primary ID
    return await this.sessionRepository.findOne({ where: { id } });
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    // Updates the record and returns the updated version
    await this.sessionRepository.update(id, updateSessionDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    // Deletes the record from the database
    return await this.sessionRepository.delete(id);
  }

  async findAllByAuthId(authId: number): Promise<Session[] | null>{
    // Custom method to find all sessions by auth ID
    return await this.sessionRepository.find({ where: { auth: { id: authId } } });
  }
}
