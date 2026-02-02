
// src/user/user.module.ts (with custom repository)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository'; // Import custom repo
import { User } from './entities/user.entity';
import { UserSubscriber } from './user.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserSubscriber], // Provide custom repo
  exports: [UserService, UserRepository, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
