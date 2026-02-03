// jwt-refresh.guard.ts
import { AuthGuard } from '@nestjs/passport';
import { Guard } from '../decorators/guard.decorator';

@Guard()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  // By extending AuthGuard('jwt-refresh'), this guard automatically
  // triggers the RefreshTokenStrategy you implemented.
}
