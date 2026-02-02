import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Service } from 'src/shared/decorators/service.decorator';
import { SessionRepository } from './session.repository';
import { Session } from './entities/session.entity';

@Service()
export class SessionService {
  private readonly MAX_SESSIONS = 5;

  constructor(
    private readonly sessionRepository: SessionRepository,
  ) {}

  async createSession(userId: number, refreshTokenHash: string) {
    // 1. Count existing sessions for this user
    const [sessions, count] = await this.sessionRepository.findAndCount({
      where: { auth: { id: userId } },
      order: { createdAt: 'ASC' }, // Oldest first
    });

    // 2. If at limit, delete the oldest one(s)
    if (count >= this.MAX_SESSIONS) {
      const oldestSession = sessions[0];
      await this.sessionRepository.delete(oldestSession.id);
    }

    // 3. Create the new session
    const newSession = this.sessionRepository.create({
      refreshTokenHash,
      auth: { id: userId },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return await this.sessionRepository.save(newSession);
  }

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


/**
 * 
 import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionService {
  private readonly MAX_SESSIONS = 5;

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async createSession(userId: number, refreshTokenHash: string) {
    // 1. Count existing sessions for this user
    const [sessions, count] = await this.sessionRepository.findAndCount({
      where: { auth: { id: userId } },
      order: { createdAt: 'ASC' }, // Oldest first
    });

    // 2. If at limit, delete the oldest one(s)
    if (count >= this.MAX_SESSIONS) {
      const oldestSession = sessions[0];
      await this.sessionRepository.delete(oldestSession.id);
    }

    // 3. Create the new session
    const newSession = this.sessionRepository.create({
      refreshTokenHash,
      auth: { id: userId },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return await this.sessionRepository.save(newSession);
  }
}

 */