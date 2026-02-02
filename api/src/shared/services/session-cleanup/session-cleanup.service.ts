// token-cleanup.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class SessionCleanupService {
  private readonly logger = new Logger(SessionCleanupService.name);

  constructor(
    @InjectRepository(RefreshToken)
    private readonly tokenRepository: Repository<RefreshToken>,
  ) {}

  // This task runs every day at midnight
  @Cron(CronExpression.EVERY_HOUR)
  async handleCleanup() {
    this.logger.debug('Starting expired token cleanup...');

    const result = await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() }) //
      .execute();

    this.logger.debug(`Cleanup complete. Removed ${result.affected} expired tokens.`);
  }
}
