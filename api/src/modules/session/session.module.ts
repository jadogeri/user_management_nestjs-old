// src/auth/session/session.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { SessionRepository } from './session.repository'; // Import your custom repo
import { SessionService } from './session.service';
import { SessionCleanupService } from 'src/shared/services/session-cleanup/session-cleanup.service';

@Module({
  imports: [
    // This registers the entity for TypeORM
    TypeOrmModule.forFeature([Session]), 
  ],
  providers: [
    SessionRepository, // <--- Add this here!
    SessionService,
    SessionCleanupService,
  ],
  exports: [
    SessionService,
    SessionRepository, // Export it if AuthService needs to inject it directly
    TypeOrmModule.forFeature([Session])
  ],
})
export class SessionModule {}
