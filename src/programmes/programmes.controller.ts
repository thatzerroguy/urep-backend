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
import { ProgrammesService } from './programmes.service';
import { ProgrammeDto } from './dto/programme.dto';

@ApiTags('Programmes')
@ApiBearerAuth()
@Controller('programmes')
export class ProgrammesController {
  constructor(private readonly programmesService: ProgrammesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new programme',
    description:
      'Creates a new programme with details including name, description, objectives, target audience, and date range',
  })
  @ApiBody({
    type: ProgrammeDto,
    description: 'Programme details to create',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Programme created successfully',
    schema: {
      example: {
        message: 'Programme created successfully',
        data: {
          id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
          name: 'Youth Development Program',
          description: 'Learn new skills and gain experience',
          objectives: ['Learn new skills', 'Gain experience'],
          target_audience: ['Youth', 'Adults'],
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          isActive: true,
          created_at: '2023-01-01T00:00:00.000Z',
        },
        status: 201,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Programme already exists',
    schema: {
      example: {
        message: 'Programme already exists, please update it instead',
        statusCode: 409,
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
  async createProgramme(@Body() programmeDto: ProgrammeDto) {
    return await this.programmesService.createProgramme(programmeDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all programmes',
    description: 'Retrieves a list of all programmes in the system',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All programmes fetched successfully',
    schema: {
      example: {
        message: 'All programmes fetched successfully',
        data: [
          {
            id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
            name: 'Youth Development Program',
            description: 'Learn new skills and gain experience',
            objectives: ['Learn new skills', 'Gain experience'],
            target_audience: ['Youth', 'Adults'],
            start_date: '2023-01-01',
            end_date: '2023-12-31',
            isActive: true,
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
  async getAllProgrammes() {
    return await this.programmesService.getAllProgrammes();
  }

  @Get('active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get active programmes',
    description:
      'Retrieves all programmes that are currently active based on start date, end date, and isActive status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active programmes fetched successfully',
    schema: {
      example: {
        message: 'Active programmes fetched successfully',
        data: [
          {
            id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
            name: 'Youth Development Program',
            description: 'Learn new skills and gain experience',
            objectives: ['Learn new skills', 'Gain experience'],
            target_audience: ['Youth', 'Adults'],
            start_date: '2023-01-01',
            end_date: '2023-12-31',
            isActive: true,
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
  async getActiveProgrammes() {
    return await this.programmesService.getActiveProgrammes();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get programme by ID',
    description: 'Retrieves a specific programme by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Programme unique identifier (UUID)',
    example: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Programme fetched successfully',
    schema: {
      example: {
        message: 'Programme fetched successfully',
        data: {
          id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
          name: 'Youth Development Program',
          description: 'Learn new skills and gain experience',
          objectives: ['Learn new skills', 'Gain experience'],
          target_audience: ['Youth', 'Adults'],
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          isActive: true,
          created_at: '2023-01-01T00:00:00.000Z',
        },
        status: 200,
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
  async getProgrammeById(@Param('id') id: string) {
    return await this.programmesService.getProgrammeById(id);
  }
}
