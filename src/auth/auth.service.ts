import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DrizzleDatabase } from '../database/database.types';
import { CreateUserDto } from './dto/create-user.dto';
import { programInfoSchema, userSchema } from '../database/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ProgramInfoDto } from './dto/program-info.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject('DRIZZLE') private readonly db: DrizzleDatabase,
    private readonly jwt: JwtService,
  ) {}

  async _signUp(signDto: CreateUserDto) {
    try {
      // Check if user already exists
      const existingUser = await this.db.query.userSchema.findFirst({
        where: eq(userSchema.email, signDto.email),
      });
      if (existingUser) {
        throw new HttpException('User with Email Exists', HttpStatus.CONFLICT);
      }

      // Hash password
      signDto.password = await bcrypt.hash(signDto.password, 10);

      // Create user
      const [user] = await this.db
        .insert(userSchema)
        .values({
          ...signDto,
          created_at: new Date(),
        })
        .returning({ id: userSchema.id, email: userSchema.email });

      // Generate JWT token
      const payload = { sub: user.id, email: user.email };
      const token = this._generateToken(payload);

      return {
        message: 'User successfully created',
        uuid: user.id,
        token: token,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('SignUp failed', error);
      throw new InternalServerErrorException({
        error: 'Internal server error',
      });
    }
  }

  async _login(loginDto: LoginDto) {
    try {
      // Check if email exists
      const user = await this.db.query.userSchema.findFirst({
        where: eq(userSchema.email, loginDto.email),
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }

      // Generate JWT token
      const token = this._generateToken({ sub: user.id, email: user.email });

      return {
        message: 'User logged in successfully',
        token: token,
        uuid: user.id,
        status: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('User login failed', error);
      throw new InternalServerErrorException({
        error: 'Internal server error',
      });
    }
  }

  private _generateToken(payload: { sub: string; email: string }) {
    return this.jwt.sign(payload);
  }

  async _programInfo(uuid: string, infoDto: ProgramInfoDto) {
    return this.db.transaction(async (tx) => {
      // Check if user exists
      const user = await tx.query.userSchema.findFirst({
        where: eq(userSchema.id, uuid),
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Create program info
      const programInfo = await tx
        .insert(programInfoSchema)
        .values({
          ...infoDto,
          user_id: user.id,
        })
        .returning();

      return {
        message: 'Program info created successfully',
        data: programInfo,
        status: HttpStatus.CREATED,
      };
    });
  }
}
