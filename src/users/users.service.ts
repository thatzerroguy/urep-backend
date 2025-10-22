import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DrizzleDatabase } from '../database/database.types';
import { eq } from 'drizzle-orm';
import { userSchema } from '../database/schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDatabase) {}

  /**
   * @author: thatzerroguy
   * Get user by email
   * @param email
   * @returns user
   */
  async findByEmail(email: string) {
    try {
      const user = await this.db.query.userSchema.findFirst({
        where: eq(userSchema.email, email),
      });
      if (!user) {
        throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
      }

      return {
        message: 'User found',
        user: user,
        status: HttpStatus.FOUND,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('FindByEmail failed', error);
      throw new InternalServerErrorException({
        error: 'Internal server error',
      });
    }
  }

  /**
   * @author: thatzerroguy
   * Get user by id
   * @param id
   * @returns user
   */
  async findById(id: string) {
    try {
      const user = await this.db.query.userSchema.findFirst({
        where: eq(userSchema.id, id),
      });
      if (!user) {
        throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
      }

      return {
        message: 'User found',
        user: user,
        status: HttpStatus.FOUND,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('FindById failed', error);
      throw new InternalServerErrorException({
        error: 'Internal server error',
      });
    }
  }

  async findAll() {
    try {
      const users = await this.db.query.userSchema.findMany();
      if (!users || users.length === 0) {
        throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
      }

      return {
        message: 'Users found',
        data: users,
        status: HttpStatus.FOUND,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('FindAll failed', error);
      throw new InternalServerErrorException({
        error: 'Internal server error',
      });
    }
  }
}
