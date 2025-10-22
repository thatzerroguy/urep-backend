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
import { userSchema } from '../database/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(@Inject('DRIZZLE') private readonly db: DrizzleDatabase) {}

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
        .returning({ id: userSchema.id });

      //TODO: Generate JWT token

      return {
        message: 'User successfully created',
        uuid: user.id,
        //token: token,
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
      //TODO: Generate JWT token

      return {
        message: 'User logged in successfully',
        //token: token,
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
}
