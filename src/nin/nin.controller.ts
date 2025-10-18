import { Controller } from '@nestjs/common';
import { NinService } from './nin.service';

@Controller('nin')
export class NinController {
  constructor(private readonly ninService: NinService) {}
}
