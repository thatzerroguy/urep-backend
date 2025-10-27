import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ResponseService } from './response.service';
import { SubmitProgrammeFormDto } from './dto/create-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@ApiTags('Responses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('response')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit programme application form',
    description:
      'Submits a complete application form for a programme. Creates responses for all form fields and establishes a registration record linking the user to the programme.',
  })
  @ApiBody({
    type: SubmitProgrammeFormDto,
    description: 'Programme ID and user responses to form fields',
    examples: {
      completeApplication: {
        summary: 'Complete application submission',
        value: {
          programme_id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
          responses: [
            {
              form_field_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              answer: 'John Doe',
            },
            {
              form_field_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
              answer: '25',
            },
            {
              form_field_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
              answer: 'Technology',
            },
            {
              form_field_id: 'd4e5f6a7-b8c9-0123-def0-234567890123',
              answer: 'I have 5 years of experience in software development',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Registration submitted successfully',
    schema: {
      example: {
        message: 'Registration submitted successfully',
        data: [
          {
            id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
            form_field_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            registration_id: 'e1f2a3b4-c5d6-7890-abcd-ef1234567890',
            answer: 'John Doe',
            created_at: '2023-01-01T00:00:00.000Z',
          },
          {
            id: '2b3c4d5e-6f7a-8901-bcde-f12345678901',
            form_field_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            registration_id: 'e1f2a3b4-c5d6-7890-abcd-ef1234567890',
            answer: '25',
            created_at: '2023-01-01T00:00:00.000Z',
          },
          {
            id: '3c4d5e6f-7a8b-9012-cdef-123456789012',
            form_field_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
            registration_id: 'e1f2a3b4-c5d6-7890-abcd-ef1234567890',
            answer: 'Technology',
            created_at: '2023-01-01T00:00:00.000Z',
          },
        ],
        registration_id: 'e1f2a3b4-c5d6-7890-abcd-ef1234567890',
        status: 201,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Programme not found',
    schema: {
      example: {
        message: 'Programme not found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data',
    schema: {
      example: {
        message: 'At least one response is required',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    schema: {
      example: {
        error: 'Internal server error',
        statusCode: 500,
      },
    },
  })
  async submitProgrammeForm(
    @Request() req: AuthenticatedRequest,
    @Body() submitProgrammeFormDto: SubmitProgrammeFormDto,
  ) {
    return await this.responseService.submitProgrammeForm(
      req.user.userId,
      submitProgrammeFormDto,
    );
  }
}
