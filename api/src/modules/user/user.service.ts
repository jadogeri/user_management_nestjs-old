import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import { Service } from '../../shared/decorators/service.decorator';
import { UserRepository } from './user.repository';

@Service()  
export class UserService {
  constructor(
    private readonly userRepository: UserRepository, // Inject the custom repository
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user); // Triggers @BeforeInsert
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async findActiveUser(): Promise<User | null> {
    return this.userRepository.findActiveUser();
  }


}
