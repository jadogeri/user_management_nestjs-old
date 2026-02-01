// Auth.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { AuthRepositoryInterface } from 'src/shared/interfaces/auth-repository.interface';
@Injectable()
export class AuthRepository extends Repository<Auth> implements AuthRepositoryInterface {
  constructor(private readonly dataSource: DataSource) {
    super(Auth, dataSource.createEntityManager());
  }

  // Add more custom methods as needed
  async findByEmail(email: string): Promise<Auth | null> {
    return this.findOne({
    where: { email: email },
    relations: ['user']
  });
}}
