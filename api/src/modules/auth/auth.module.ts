import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { AuthRepository } from './auth.repository';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { BcryptService } from 'src/shared/services/bcrypt.service';
import { TokenModule } from 'src/shared/services/token/token.module';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [SessionModule, PassportModule, UserModule, TokenModule, TypeOrmModule.forFeature([Auth])],
  controllers: [AuthController], 
  providers: [BcryptService, AuthService,  AuthRepository, LocalStrategy],
  exports: [AuthService, AuthRepository, TypeOrmModule.forFeature([Auth])],
})
export class AuthModule {}
