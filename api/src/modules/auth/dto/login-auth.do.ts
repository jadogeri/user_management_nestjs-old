import { PickType } from '@nestjs/mapped-types';
import { Auth } from '../entities/auth.entity';


// 2. Pick email from Auth Entity (note: password usually isn't in Entity as 'password')
export class AuthLoginDto extends PickType(Auth, ['email', 'password'] as const) {}

