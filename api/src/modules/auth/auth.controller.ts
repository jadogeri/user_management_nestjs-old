import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { access } from 'fs';
import { Auth } from './entities/auth.entity';
import { AuthLoginDto } from './dto/login-auth.do';
import { LocalAuthGuard } from 'src/shared/guards/local-auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import type { UserPayload } from 'src/shared/interfaces/user-payload.interface';

@Controller('auths')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ 
    type: CreateAuthDto,
    examples: {
      example1: {
        summary: 'Example Auth Creation',
        value: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', age: 30, password:"password#W@" }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    schema: {
      example: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 30 }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createAuthDto: CreateAuthDto): Promise<any> {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ 
    type: AuthLoginDto,
    examples: {
      example1: {
        summary: 'Example Login',
        value: { email: 'john.doe@example.com', password:"password#W@" }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    schema: {
      example: { id: 1, refreshToken: "some-refresh-token", accessToken: "some-access-token" }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseGuards(LocalAuthGuard)
  async signIn(@User() user: UserPayload): Promise<any> {
    console.log("AuthController: Received login request for:", user.email);
    console.log("AuthController: Passing to AuthService.signIn", user);
    return this.authService.signIn(user);
  }

  @Post(':id')
  refresh(@Param('id') id: string) {
    return {"message": `This action refreshes a #${id} auth`};
  }

  @Patch(':id')
  forgotPassword(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return {"message": `This action updates a #${id} auth`};
  }

  @Delete(':id')
  resetPassword(@Param('id') id: string) {
    return {"message": `This action removes a #${id} auth`};
  }
}
