import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NinService } from './nin.service';
import { NinController } from './nin.controller';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [ConfigModule, SmsModule],
  controllers: [NinController],
  providers: [NinService],
  exports: [NinService], // Export service for use in other modules
})
export class NinModule {}
