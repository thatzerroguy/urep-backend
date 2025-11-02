import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { SmsService } from './sms.service';
import { ValidationPipe } from '../validation/validation.pipe';
import { SmsDto, smsSchema } from './dto/sms.dto';
import { VerifyOtpDto, verifyOtpSchema } from './dto/verify-otp.dto';

@ApiTags('sms')
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe(smsSchema))
  @ApiOperation({
    summary: 'Send OTP to phone number',
    description:
      'Sends a 6-digit OTP via SMS to the provided phone number. OTP is valid for 10 minutes.',
  })
  @ApiBody({
    type: SmsDto,
    description: 'Phone number to send OTP',
  })
  @ApiOkResponse({
    description: 'OTP sent successfully',
    schema: {
      example: {
        success: true,
        message: 'OTP sent successfully',
        phoneNumber: '2348012345678',
        otp: '123456', // Only in development mode
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid phone number format',
    schema: {
      examples: {
        invalidFormat: {
          summary: 'Invalid format',
          value: {
            message: 'Invalid phone number format',
            error: 'Bad Request',
            statusCode: 400,
          },
        },
        validationFailed: {
          summary: 'Validation failed',
          value: {
            message: 'Validation failed',
            error: {
              issues: [
                {
                  code: 'too_small',
                  exact: true,
                  message: 'Phone number must be 13 digits (234XXXXXXXXXX)',
                  path: ['phoneNumber'],
                },
              ],
            },
            statusCode: 400,
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'SMS service unavailable',
    schema: {
      example: {
        message: 'Unable to send OTP. Please try again later.',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  async sendOtp(@Body() smsDto: SmsDto) {
    return this.smsService.sendOtp(smsDto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe(verifyOtpSchema))
  @ApiOperation({
    summary: 'Verify OTP',
    description:
      'Verify the OTP sent to a phone number. Maximum 3 attempts allowed.',
  })
  @ApiBody({
    type: VerifyOtpDto,
    description: 'Phone number and OTP code to verify',
  })
  @ApiOkResponse({
    description: 'OTP verified successfully',
    schema: {
      example: {
        success: true,
        message: 'OTP verified successfully',
        phoneNumber: '2348012345678',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'No OTP found for phone number',
    schema: {
      example: {
        message:
          'No OTP found for this phone number. Please request a new OTP.',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid OTP or expired',
    schema: {
      examples: {
        invalidOtp: {
          summary: 'Invalid OTP',
          value: {
            message: 'Invalid OTP. 2 attempts remaining.',
            error: 'Unauthorized',
            statusCode: 401,
          },
        },
        expired: {
          summary: 'OTP expired',
          value: {
            message: 'OTP has expired. Please request a new OTP.',
            error: 'Unauthorized',
            statusCode: 401,
          },
        },
        maxAttempts: {
          summary: 'Maximum attempts exceeded',
          value: {
            message:
              'Maximum verification attempts exceeded. Please request a new OTP.',
            error: 'Unauthorized',
            statusCode: 401,
          },
        },
      },
    },
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.smsService.verifyOtp(verifyOtpDto);
  }
}
