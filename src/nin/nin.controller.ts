import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { NinService } from './nin.service';
import { ValidationPipe } from '../validation/validation.pipe';
import { NinRequestDto, ninRequestSchema } from './dto/nin-request.dto';

@ApiTags('nin')
@Controller('nin')
export class NinController {
  constructor(private readonly ninService: NinService) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe(ninRequestSchema))
  @ApiOperation({
    summary: 'Verify National Identification Number (NIN)',
    description:
      'Verify a Nigerian NIN by validating it against the QoreID identity verification service. ' +
      'Requires only the 11-digit NIN.',
  })
  @ApiBody({
    type: NinRequestDto,
    description: 'NIN verification details',
  })
  @ApiOkResponse({
    description: 'NIN verification successful',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        firstname: 'John',
        lastname: 'Doe',
        nin: '12345678901',
        phone: '+2348012345678',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        status: 'verified',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request or NIN details do not match',
    schema: {
      examples: {
        invalidFormat: {
          summary: 'Invalid NIN format',
          value: {
            message: 'Invalid NIN format. Must be 11 digits.',
            error: 'Bad Request',
            statusCode: 400,
          },
        },
        notFound: {
          summary: 'NIN not found',
          value: {
            message: 'NIN not found or details do not match',
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
                  minimum: 11,
                  type: 'string',
                  inclusive: true,
                  exact: true,
                  message: 'NIN must be exactly 11 digits',
                  path: ['nin'],
                },
              ],
            },
            statusCode: 400,
          },
        },
      },
    },
  })
  @ApiTooManyRequestsResponse({
    description: 'Rate limit exceeded',
    schema: {
      example: {
        message: 'Too many verification attempts. Please try again later.',
        error: 'Too Many Requests',
        statusCode: 429,
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error or service unavailable',
    schema: {
      examples: {
        serviceUnavailable: {
          summary: 'Verification service unavailable',
          value: {
            message: 'Identity verification service unavailable',
            error: 'Internal Server Error',
            statusCode: 500,
          },
        },
        timeout: {
          summary: 'Request timeout',
          value: {
            message: 'Verification request timed out',
            error: 'Internal Server Error',
            statusCode: 500,
          },
        },
        networkError: {
          summary: 'Network error',
          value: {
            message: 'Unable to connect to verification service',
            error: 'Internal Server Error',
            statusCode: 500,
          },
        },
      },
    },
  })
  async verifyNin(@Body() ninRequestDto: NinRequestDto) {
    return this.ninService.verifyNin(ninRequestDto);
  }
}
