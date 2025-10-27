import { Module } from '@nestjs/common';
import { FormfieldService } from './formfield.service';
import { FormfieldController } from './formfield.controller';

@Module({
  controllers: [FormfieldController],
  providers: [FormfieldService],
})
export class FormfieldModule {}
