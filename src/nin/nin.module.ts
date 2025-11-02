import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NinService } from './nin.service';
import { NinController } from './nin.controller';

@Module({
  imports: [ConfigModule],
  controllers: [NinController],
  providers: [NinService],
  exports: [NinService], // Export service for use in other modules
})
export class NinModule {}
