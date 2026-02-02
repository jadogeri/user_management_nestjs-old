import { Service } from 'src/shared/decorators/service.decorator';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthRepository } from './auth.repository';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { UserGeneratorUtil } from 'src/utils/user-generator.util';
import { Auth } from './entities/auth.entity';
import { AuthGeneratorUtil } from 'src/utils/auth-generator.util';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt  from 'bcryptjs';
import { Logger } from '@nestjs/common';
import { BcryptService } from 'src/shared/services/bcrypt.service';
import { UserRepository } from '../user/user.repository';
import { UserPayload } from 'src/shared/interfaces/user-payload.interface';
import { TokenService } from 'src/shared/services/token/token.service';
import { SessionService } from '../session/session.service';

@Service()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    //private readonly configService: ConfigService,
    //private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly authRepository: AuthRepository, // Inject the custom repository
    private readonly userService: UserService, // Inject the TypeORM repository
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
  ) {}


async create(createAuthDto: CreateAuthDto): Promise<Auth | null> {
  const { email, password, firstName, lastName, age } = createAuthDto;
  
  const existingUser = await this.authRepository.findOne({ where: { email } });
  if (existingUser) {
    throw new ConflictException(`Email address "${email}" has already been registered.`);
  }

  const newUser = UserGeneratorUtil.generate({ firstName, lastName, age });
  const hashedPassword = await this.bcryptService.hashPassword(password);
  
  const newAuth = AuthGeneratorUtil.generate({ email, password: hashedPassword });
  newAuth.user = newUser; // Cascading will handle the user creation

  const savedUser = await this.userRepository.save(newUser);
newAuth.user = savedUser;
const savedAuth = await this.authRepository.save(newAuth);

  
  // RELOAD: This fetches the Auth AND the User together
   const auth =  await this.authRepository.findOne({
    where: { id: savedAuth.id },
    relations: ['user']
  });
  console.log("Newly created auth with user:", auth);
  return auth;
}


  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async signIn(userPayload: UserPayload): Promise<{ accessToken: string; refreshToken: string; userId: number } | null> {
    console.log("AuthService.signIn called with userPayload:", userPayload);
    const data = await this.tokenService.generateAuthTokens(userPayload); 
    console.log("Generated tokens:", data);
    // Here you would implement the actual token generation logic

    //create a session
    //const refreshTokenHash = await this.bcryptService.hashData(data.refreshToken);
    //#TODO : Hash the refresh token before storing
    // For demo purposes, we are storing it as is
    // data.refreshToken will be hashed later with argon2
    const refreshTokenHash = data.refreshToken; // Storing plain for demo; hash in production
    const session = await this.sessionService.createSession(userPayload.userId, refreshTokenHash);
    console.log("Created session:", session);
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userId: userPayload.userId
    }

  }

 async verifyUser(email: string, password: string) {
  try {
    const auth = await this.authRepository.findByEmail(email);
    if (!auth) {
      throw new UnauthorizedException("User not found");
    }

    // ALWAYS use the service so the pepper logic stays identical
    const authenticated = await this.bcryptService.comparePassword(password, auth.password);

    if (!authenticated) {
      throw new UnauthorizedException("Invalid credentials");
    }
      const user = await this.userRepository.findOne({
    where: { id: auth.user.id },
    relations: ['roles', 'roles.permissions'], // This is crucial
  });
  
    return user;
  } catch (error) {
    this.logger.error('Verify user error', error);
    throw new UnauthorizedException('Credentials are not valid');
  }
}
  
}
