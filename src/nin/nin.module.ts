import { Module } from '@nestjs/common';
import { NinService } from './nin.service';
import { NinController } from './nin.controller';

@Module({
  controllers: [NinController],
  providers: [NinService],
})
export class NinModule {}
