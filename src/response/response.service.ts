import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { DrizzleDatabase } from '../database/database.types';
import { SubmitProgrammeFormDto } from './dto/create-response.dto';
import { eq, inArray } from 'drizzle-orm';
import {
  programmeSchema,
  registrationSchema,
  responseSchema,
} from '../database/schema';
import { randomUUID } from 'crypto';

@Injectable()
export class ResponseService {
  private readonly logger = new Logger(ResponseService.name);
  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDatabase) {}

  async submitProgrammeForm(
    user_id: string,
    submitProgrammeFormDto: SubmitProgrammeFormDto,
  ) {
    const { programme_id, responses } = submitProgrammeFormDto;

    return this.db.transaction(async (tx) => {
      // Ensure programme exists
      const programme = await tx.query.programmeSchema.findFirst({
        where: eq(programmeSchema.id, programme_id),
      });
      if (!programme) {
        throw new HttpException('Programme not found', HttpStatus.NOT_FOUND);
      }

      // Insert responses in bulk
      const response = await tx
        .insert(responseSchema)
        .values(
          responses.map((r) => ({
            form_field_id: r.form_field_id,
            answer: r.answer,
            created_at: new Date(),
          })),
        )
        .returning();

      // Create registration
      const [registration] = await tx
        .insert(registrationSchema)
        .values({
          id: randomUUID(),
          user_id: user_id,
          programme_id: programme_id,
          created_at: new Date(),
        })
        .returning();

      // Link registration to responses
      await tx
        .update(responseSchema)
        .set({ registration_id: registration.id })
        .where(
          inArray(
            responseSchema.id,
            response.map((r) => r.id),
          ),
        );

      return {
        message: 'Registration submitted successfully',
        data: response,
        registration_id: registration.id,
        status: HttpStatus.CREATED,
      };
    });
  }
}
