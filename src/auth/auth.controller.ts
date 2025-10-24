import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ValidationPipe } from '../validation/validation.pipe';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { LoginDto, loginSchema } from './dto/login.dto';
import { ProgramInfoDto, programInfoSchema } from './dto/program-info.dto';

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

  @Post('program-info')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe(programInfoSchema))
  @ApiOperation({
    summary: 'Submit program information',
    description: 'Submit additional program-related information for a user',
  })
  @ApiParam({
    name: 'uuid',
    description: 'User UUID',
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: ProgramInfoDto,
    description: 'Program information details',
    examples: {
      example1: {
        summary: 'Sample program information',
        value: {
          programme: 'Youth Development Program',
          expectations: 'Learn new skills and gain experience',
          knowledge: 'Basic computer skills and programming',
          organization: 'IDCODE Foundation',
          similar_participation: 'Yes, participated in tech bootcamp',
          previous_fmyd: 'No',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Program information submitted successfully',
    schema: {
      example: {
        message: 'Program information saved successfully',
        status: 201,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or unauthorized UUID',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401,
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
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        error: 'Internal server error',
        statusCode: 500,
      },
    },
  })
  async programInfo(
    @Param(
      'uuid',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.UNAUTHORIZED }),
    )
    uuid: string,
    @Body()
    infoDto: ProgramInfoDto,
  ) {
    return await this.authService._programInfo(uuid, infoDto);
  }
}
