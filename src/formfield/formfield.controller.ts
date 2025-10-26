import { Controller } from '@nestjs/common';
import { FormfieldService } from './formfield.service';

@Controller('formfield')
export class FormfieldController {
  constructor(private readonly formfieldService: FormfieldService) {}
}
