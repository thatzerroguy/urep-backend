import { Test, TestingModule } from '@nestjs/testing';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';
import { HttpStatus } from '@nestjs/common';
import { SubmitProgrammeFormDto } from './dto/create-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';

describe('ResponseController', () => {
  let controller: ResponseController;
  let service: ResponseService;

  const mockResponseService = {
    submitProgrammeForm: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponseController],
      providers: [
        {
          provide: ResponseService,
          useValue: mockResponseService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<ResponseController>(ResponseController);
    service = module.get<ResponseService>(ResponseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('submitProgrammeForm', () => {
    it('should successfully submit a programme form', async () => {
      const userId = '550e8400-e29b-41d4-a716-446655440000';
      const mockRequest = {
        user: {
          userId: userId,
          email: 'john.doe@example.com',
        },
      } as any;

      const submitProgrammeFormDto: SubmitProgrammeFormDto = {
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
        ],
      };

      const expectedResult = {
        message: 'Registration submitted successfully',
        data: [
          {
            id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
            form_field_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            registration_id: 'e1f2a3b4-c5d6-7890-abcd-ef1234567890',
            answer: 'John Doe',
            created_at: new Date('2023-01-01'),
          },
          {
            id: '2b3c4d5e-6f7a-8901-bcde-f12345678901',
            form_field_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            registration_id: 'e1f2a3b4-c5d6-7890-abcd-ef1234567890',
            answer: '25',
            created_at: new Date('2023-01-01'),
          },
          {
            id: '3c4d5e6f-7a8b-9012-cdef-123456789012',
            form_field_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
            registration_id: 'e1f2a3b4-c5d6-7890-abcd-ef1234567890',
            answer: 'Technology',
            created_at: new Date('2023-01-01'),
          },
        ],
        registration_id: 'e1f2a3b4-c5d6-7890-abcd-ef1234567890',
        status: HttpStatus.CREATED,
      };

      mockResponseService.submitProgrammeForm.mockResolvedValue(expectedResult);

      const result = await controller.submitProgrammeForm(
        mockRequest,
        submitProgrammeFormDto,
      );

      expect(result).toEqual(expectedResult);
      expect(mockResponseService.submitProgrammeForm).toHaveBeenCalledWith(
        userId,
        submitProgrammeFormDto,
      );
      expect(mockResponseService.submitProgrammeForm).toHaveBeenCalledTimes(1);
    });

    it('should throw not found error when programme does not exist', async () => {
      const userId = '550e8400-e29b-41d4-a716-446655440000';
      const mockRequest = {
        user: {
          userId: userId,
          email: 'john.doe@example.com',
        },
      } as any;

      const submitProgrammeFormDto: SubmitProgrammeFormDto = {
        programme_id: 'nonexistent-id',
        responses: [
          {
            form_field_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            answer: 'John Doe',
          },
        ],
      };

      mockResponseService.submitProgrammeForm.mockRejectedValue({
        message: 'Programme not found',
        statusCode: HttpStatus.NOT_FOUND,
      });

      await expect(
        controller.submitProgrammeForm(mockRequest, submitProgrammeFormDto),
      ).rejects.toEqual({
        message: 'Programme not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw bad request error when responses array is empty', async () => {
      const userId = '550e8400-e29b-41d4-a716-446655440000';
      const mockRequest = {
        user: {
          userId: userId,
          email: 'john.doe@example.com',
        },
      } as any;

      const submitProgrammeFormDto: SubmitProgrammeFormDto = {
        programme_id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
        responses: [],
      };

      mockResponseService.submitProgrammeForm.mockRejectedValue({
        message: 'At least one response is required',
        statusCode: HttpStatus.BAD_REQUEST,
      });

      await expect(
        controller.submitProgrammeForm(mockRequest, submitProgrammeFormDto),
      ).rejects.toEqual({
        message: 'At least one response is required',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    });

    it('should use authenticated user ID from request', async () => {
      const userId = 'authenticated-user-id';
      const mockRequest = {
        user: {
          userId: userId,
          email: 'authenticated@example.com',
        },
      } as any;

      const submitProgrammeFormDto: SubmitProgrammeFormDto = {
        programme_id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
        responses: [
          {
            form_field_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            answer: 'Test Answer',
          },
        ],
      };

      const expectedResult = {
        message: 'Registration submitted successfully',
        data: [],
        registration_id: 'reg-id',
        status: HttpStatus.CREATED,
      };

      mockResponseService.submitProgrammeForm.mockResolvedValue(expectedResult);

      await controller.submitProgrammeForm(mockRequest, submitProgrammeFormDto);

      expect(mockResponseService.submitProgrammeForm).toHaveBeenCalledWith(
        userId,
        submitProgrammeFormDto,
      );
    });
  });
});
