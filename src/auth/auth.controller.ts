import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationPipe } from '../validation/validation.pipe';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { LoginDto, loginSchema } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe(createUserSchema))
  @Post('signup')
  async signup(@Body() signupDto: CreateUserDto) {
    return await this.authService._signUp(signupDto);
  }

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe(loginSchema))
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService._login(loginDto);
  }
}
