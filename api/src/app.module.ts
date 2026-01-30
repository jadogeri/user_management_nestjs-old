import { Module } from '@nestjs/common';
  import { UserModule } from './resources/user/user.module';
import { AuthModule } from './resources/auth/auth.module';
import { ProfileModule } from './resources/profile/profile.module';
import { ContactModule } from './resources/contact/contact.module';

@Module({
  imports: [UserModule, AuthModule, ProfileModule, ContactModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
