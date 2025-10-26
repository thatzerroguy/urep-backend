import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DrizzleDatabase } from '../database/database.types';
import { LoginDto } from './dto/login.dto';
import { eq } from 'drizzle-orm';
import { adminSchema } from '../database/schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(
    @Inject('DRIZZLE') private readonly db: DrizzleDatabase,
    private readonly jwt: JwtService,
  ) {}

  async _login(loginDto: LoginDto) {
    try {
      // Check if email exists
      const admin = await this.db.query.adminSchema.findFirst({
        where: eq(adminSchema.email, loginDto.email),
      });
      if (!admin) {
        throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        admin.password,
      );
      if (!isPasswordValid) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }

      // generate token
      const token = this._generateToken({ sub: admin.id, email: admin.email });

      return {
        message: 'Admin logged in successfully',
        token: token,
        uuid: admin.id,
        status: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Admin login failed', error);
      throw new InternalServerErrorException({
        error: 'Internal server error',
      });
    }
  }

  private _generateToken(payload: { sub: string; email: string }) {
    return this.jwt.sign(payload);
  }
}
