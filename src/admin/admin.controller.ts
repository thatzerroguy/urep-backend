import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ValidationPipe } from '../validation/validation.pipe';
import { LoginDto, loginSchema } from './dto/login.dto';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe(loginSchema))
  @ApiOperation({
    summary: 'Admin login',
    description: 'Authenticate a admin with email and password',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Admin login credentials',
    examples: {
      example1: {
        summary: 'Sample login',
        value: {
          email: 'admin@example.com',
          password: 'SecurePassword123!',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Admin logged in successfully',
    schema: {
      example: {
        message: 'Admin logged in successfully',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        status: 200,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Admin not found',
    schema: {
      example: {
        message: 'Admin not found',
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
    return await this.adminService._login(loginDto);
  }
}
