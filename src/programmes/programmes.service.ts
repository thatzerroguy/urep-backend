import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DrizzleDatabase } from '../database/database.types';
import { ProgrammeDto } from './dto/programme.dto';
import { and, eq, gte, lte } from 'drizzle-orm';
import { programmeSchema } from '../database/schema';

@Injectable()
export class ProgrammesService {
  private readonly logger = new Logger(ProgrammesService.name);
  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDatabase) {}

  async createProgramme(programmeDto: ProgrammeDto) {
    try {
      // Check if programme already exists
      const programmeExists = await this.db.query.programmeSchema.findFirst({
        where: eq(programmeSchema.name, programmeDto.name),
      });
      if (programmeExists) {
        throw new HttpException(
          'Programme already exists, please update it instead',
          HttpStatus.CONFLICT,
        );
      }

      // Create programme
      const [programme] = await this.db
        .insert(programmeSchema)
        .values({
          ...programmeDto,
          created_at: new Date(),
        })
        .returning();

      return {
        message: 'Programme created successfully',
        data: programme,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Programme create failed', error);
      throw new InternalServerErrorException({
        error: 'Internal server error',
      });
    }
  }

  async getAllProgrammes() {
    try {
      const programmes = await this.db.query.programmeSchema.findMany();
      return {
        message: 'All programmes fetched successfully',
        data: programmes,
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

  async getProgrammeById(id: string) {
    try {
      const programme = await this.db.query.programmeSchema.findFirst({
        where: eq(programmeSchema.id, id),
      });
      if (!programme) {
        throw new HttpException('Programme not found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Programme fetched successfully',
        data: programme,
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

  async getActiveProgrammes() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const programmes = await this.db.query.programmeSchema.findMany({
        where: and(
          lte(programmeSchema.start_date, today),
          gte(programmeSchema.end_date, today),
          eq(programmeSchema.isActive, true),
        ),
      });
      return {
        message: 'Active programmes fetched successfully',
        data: programmes,
        status: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Active programmes fetch failed', error);
      throw new InternalServerErrorException({
        error: 'Internal server error',
      });
    }
  }
}
