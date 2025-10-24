import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ValidationPipe } from '../validation/validation.pipe';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { LoginDto, loginSchema } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe(createUserSchema))
  @ApiOperation({
    summary: 'Create a new user account',
    description:
      'Register a new user with their details and receive a JWT token',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration details',
    examples: {
      example1: {
        summary: 'Sample user registration',
        value: {
          organisation: 'IDCODE',
          nin: '12345678901234567890',
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'SecurePassword123!',
          phone: '+2348012345678',
          dob: '1990-01-01',
          gender: 'male',
          state: 'Lagos',
          lga: 'Ikeja',
          idcode: 'IDC001',
          terms: true,
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'User successfully created',
    schema: {
      example: {
        message: 'User successfully created',
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        status: 201,
      },
    },
  })
  @ApiConflictResponse({
    description: 'User with email already exists',
    schema: {
      example: {
        message: 'User with Email Exists',
        statusCode: 409,
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        error: 'Internal server error',
        statusCode: 500,
      },
    },
  })
  async signup(@Body() signupDto: CreateUserDto) {
    return await this.authService._signUp(signupDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe(loginSchema))
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate a user with email and password',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
    examples: {
      example1: {
        summary: 'Sample login',
        value: {
          email: 'john.doe@example.com',
          password: 'SecurePassword123!',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'User logged in successfully',
    schema: {
      example: {
        message: 'User logged in successfully',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        status: 200,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      example: {
        message: 'User not found',
        statusCode: 404,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid password',
    schema: {
      example: {
        message: 'Invalid password',
        statusCode: 401,
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        error: 'Internal server error',
        statusCode: 500,
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService._login(loginDto);
  }
}
