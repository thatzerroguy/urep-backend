import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DrizzleDatabase } from '../database/database.types';
import { FormCreationDto } from './dto/form-creation.dto';
import { eq } from 'drizzle-orm';
import { formFieldsSchema, programmeSchema } from '../database/schema';

@Injectable()
export class FormfieldService {
  private readonly logger = new Logger(FormfieldService.name);
  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDatabase) {}

  async createFormField(formCreationDto: FormCreationDto) {
    const { programme_id, fields } = formCreationDto;

    return this.db.transaction(async (tx) => {
      // Check if programme exists
      const programme = await tx.query.programmeSchema.findFirst({
        where: eq(programmeSchema.id, programme_id),
      });
      if (!programme) {
        throw new HttpException('Programme not found', HttpStatus.NOT_FOUND);
      }

      // Insert form fields in bulk
      const formFieldsValues = fields.map((field) => ({
        ...field,
        programme_id: programme.id,
        created_at: new Date(),
      }));

      // Create form fields
      const formField = await tx
        .insert(formFieldsSchema)
        .values(formFieldsValues)
        .returning();

      return {
        message: 'Form fields created successfully',
        data: formField,
        status: HttpStatus.CREATED,
      };
    });
  }

  async getProgrammeForm(programmeId: string) {
    try {
      const formFields = await this.db.query.formFieldsSchema.findMany({
        where: eq(formFieldsSchema.programme_id, programmeId),
      });
      return {
        message: 'Form fields fetched successfully',
        data: formFields,
        status: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Programme fetch failed', error);
      throw new InternalServerErrorException({
        error: 'Internal server error',
      });
    }
  }
}
