import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
  import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ContactModule } from './modules/contact/contact.module';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import dataSourceOptions from './configs/type-orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from './modules/session/session.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ArgonModule } from './modules/argon/argon.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [    
    UserModule, 
    AuthModule, 
    ProfileModule, 
    ContactModule,
    PermissionModule,
    RoleModule,
    TypeOrmModule.forRoot({ ...dataSourceOptions }),
    ConfigModule.forRoot({   isGlobal: true,  }),
    SessionModule, // Makes ConfigService available everywhere
    ScheduleModule.forRoot(), ArgonModule, //
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 1 minute in milliseconds
          limit: 10,
        },
      ],
    })
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Apply rate limiting globally
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude('auth/(.*)')
      .forRoutes('users', 'profiles', 'contacts');
  }
}

