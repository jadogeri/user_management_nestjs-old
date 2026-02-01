import { PickType, IntersectionType } from '@nestjs/mapped-types';
import { User } from 'src/modules/user/entities/user.entity';
import { Auth } from '../entities/auth.entity';

// 1. Pick name fields from User Entity
class UserPart extends PickType(User, ['firstName', 'lastName','age'] as const) {}

// 2. Pick email from Auth Entity (note: password usually isn't in Entity as 'password')
class AuthPart extends PickType(Auth, ['email', 'password'] as const) {}

// 3. Combine them and add the raw password field manually
export class CreateAuthDto extends IntersectionType(UserPart, AuthPart) {}

