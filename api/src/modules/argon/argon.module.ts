import { Module } from '@nestjs/common';
import { ArgonService } from './argon.service';

@Module({
  controllers: [],
  providers: [ArgonService],
})
export class ArgonModule {}
