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

@Service()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    //private readonly configService: ConfigService,
    //private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly authRepository: AuthRepository, // Inject the custom repository
    private readonly userService: UserService, // Inject the TypeORM repository
    private readonly userRepository: UserRepository
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

  async signIn(authLoginDto: { email: string; password: string; }): Promise<{ accessToken: string; refreshToken: string; userId: number } | null> {
    const { email, password } = authLoginDto;   
    return {
      accessToken: "some-access-token",
      refreshToken: "some-refresh-token",
      userId: 1
    }

    /**
     * 
       try {
      const expirationMs = parseInt(
        this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS'),
      );
      const refreshExpirationMs = parseInt(
        this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS'),
      );

      const expiresAccessToken = new Date(Date.now() + expirationMs);
      const expiresRefreshToken = new Date(Date.now() + refreshExpirationMs);

      const tokenPayload = {
        userId: user.id,
      };

      const accessToken = this.jwtService.sign(tokenPayload, {
        secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.getOrThrow(
          'JWT_ACCESS_TOKEN_EXPIRATION_MS',
        )}ms`,
      });

      const refreshToken = this.jwtService.sign(tokenPayload, {
        secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.getOrThrow(
          'JWT_REFRESH_TOKEN_EXPIRATION_MS',
        )}ms`,
      });

      const userData = {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.userAvatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      await this.usersService.updateUser(user.id, {
        refreshToken: await hash(refreshToken, 10),
      });

      response.cookie('Authentication', accessToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        expires: expiresAccessToken,
      });

      response.cookie('Refresh', refreshToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        expires: expiresRefreshToken,
      });

      return response.json(userData);
    } catch (error) {
      this.logger.error('Login error:', {
        error: error.message,
        userId: user.id,
        stack: error.stack,
      });
      throw new UnauthorizedException(
        'Failed to process login. Please try again.',
      );
    }
     */
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
    
    return await this.userService.findOne(auth.user.id);
  } catch (error) {
    this.logger.error('Verify user error', error);
    throw new UnauthorizedException('Credentials are not valid');
  }
}
  
}
