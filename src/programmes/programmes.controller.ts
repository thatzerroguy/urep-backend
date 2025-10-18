import { Controller } from '@nestjs/common';
import { ProgrammesService } from './programmes.service';

@Controller('programmes')
export class ProgrammesController {
  constructor(private readonly programmesService: ProgrammesService) {}
}
