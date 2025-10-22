import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

@Injectable()
export class ValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ValidationPipe.name);
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata): any {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          error: error,
        });
      }
      this.logger.error('Validation error', error);
      throw new BadRequestException('Validation failed');
    }
  }
}
