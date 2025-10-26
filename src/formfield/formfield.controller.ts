import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FormfieldService } from './formfield.service';
import { FormCreationDto } from './dto/form-creation.dto';

@ApiTags('Form Fields')
@ApiBearerAuth()
@Controller('formfield')
export class FormfieldController {
  constructor(private readonly formfieldService: FormfieldService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create form fields for a programme',
    description:
      'Creates multiple form fields for a specific programme in a single transaction. Form fields define the structure of application forms.',
  })
  @ApiBody({
    type: FormCreationDto,
    description: 'Programme ID and array of form fields to create',
    examples: {
      example1: {
        summary: 'Basic form fields',
        value: {
          programme_id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
          fields: [
            {
              label: 'Full Name',
              type: 'text',
              required: true,
            },
            {
              label: 'Age',
              type: 'number',
              required: true,
            },
            {
              label: 'Area of Expertise',
              type: 'select',
              required: true,
              options: ['Technology', 'Arts', 'Science', 'Business'],
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Form fields created successfully',
    schema: {
      example: {
        message: 'Form fields created successfully',
        data: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            programme_id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
            label: 'Full Name',
            type: 'text',
            required: true,
            options: null,
            created_at: '2023-01-01T00:00:00.000Z',
          },
          {
            id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            programme_id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
            label: 'Area of Expertise',
            type: 'select',
            required: true,
            options: ['Technology', 'Arts', 'Science', 'Business'],
            created_at: '2023-01-01T00:00:00.000Z',
          },
        ],
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
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    schema: {
      example: {
        error: 'Internal server error',
        statusCode: 500,
      },
    },
  })
  async createFormField(@Body() formCreationDto: FormCreationDto) {
    return await this.formfieldService.createFormField(formCreationDto);
  }

  @Get(':programmeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get form fields by programme ID',
    description:
      'Retrieves all form fields associated with a specific programme. Returns the complete form structure for that programme.',
  })
  @ApiParam({
    name: 'programmeId',
    description: 'Programme unique identifier (UUID)',
    example: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Form fields fetched successfully',
    schema: {
      example: {
        message: 'Form fields fetched successfully',
        data: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            programme_id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
            label: 'Full Name',
            type: 'text',
            required: true,
            options: null,
            created_at: '2023-01-01T00:00:00.000Z',
          },
          {
            id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            programme_id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
            label: 'Date of Birth',
            type: 'date',
            required: true,
            options: null,
            created_at: '2023-01-01T00:00:00.000Z',
          },
          {
            id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
            programme_id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
            label: 'Area of Expertise',
            type: 'select',
            required: true,
            options: ['Technology', 'Arts', 'Science', 'Business'],
            created_at: '2023-01-01T00:00:00.000Z',
          },
        ],
        status: 200,
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
  async getProgrammeForm(@Param('programmeId') programmeId: string) {
    return await this.formfieldService.getProgrammeForm(programmeId);
  }
}
