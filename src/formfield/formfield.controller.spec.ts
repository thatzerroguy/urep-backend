import { Test, TestingModule } from '@nestjs/testing';
import { FormfieldController } from './formfield.controller';
import { FormfieldService } from './formfield.service';
import { HttpStatus } from '@nestjs/common';
import { FormCreationDto } from './dto/form-creation.dto';

describe('FormfieldController', () => {
  let controller: FormfieldController;
  let service: FormfieldService;

  const mockFormfieldService = {
    createFormField: jest.fn(),
    getProgrammeForm: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormfieldController],
      providers: [
        {
          provide: FormfieldService,
          useValue: mockFormfieldService,
        },
      ],
    }).compile();

    controller = module.get<FormfieldController>(FormfieldController);
    service = module.get<FormfieldService>(FormfieldService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createFormField', () => {
    it('should successfully create form fields', async () => {
      const formCreationDto: FormCreationDto = {
        programme_id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
        fields: [
          {
            programme_id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
            label: 'Full Name',
            type: 'text',
            required: true,
          },
          {
            programme_id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
            label: 'Age',
            type: 'number',
            required: true,
          },
          {
            programme_id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
            label: 'Area of Expertise',
            type: 'select',
            required: true,
            options: ['Technology', 'Arts', 'Science', 'Business'],
          },
        ],
      };

      const expectedResult = {
        message: 'Form fields created successfully',
        data: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            programme_id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
            label: 'Full Name',
            type: 'text',
            required: true,
            options: null,
            created_at: new Date('2023-01-01'),
          },
          {
            id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            programme_id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
            label: 'Area of Expertise',
            type: 'select',
            required: true,
            options: ['Technology', 'Arts', 'Science', 'Business'],
            created_at: new Date('2023-01-01'),
          },
        ],
        status: HttpStatus.CREATED,
      };

      mockFormfieldService.createFormField.mockResolvedValue(expectedResult);

      const result = await controller.createFormField(formCreationDto);

      expect(result).toEqual(expectedResult);
      expect(mockFormfieldService.createFormField).toHaveBeenCalledWith(
        formCreationDto,
      );
      expect(mockFormfieldService.createFormField).toHaveBeenCalledTimes(1);
    });

    it('should throw not found error when programme does not exist', async () => {
      const formCreationDto: FormCreationDto = {
        programme_id: 'nonexistent-id',
        fields: [
          {
            programme_id: 'nonexistent-id',
            label: 'Full Name',
            type: 'text',
            required: true,
          },
        ],
      };

      mockFormfieldService.createFormField.mockRejectedValue({
        message: 'Programme not found',
        statusCode: HttpStatus.NOT_FOUND,
      });

      await expect(controller.createFormField(formCreationDto)).rejects.toEqual(
        {
          message: 'Programme not found',
          statusCode: HttpStatus.NOT_FOUND,
        },
      );
    });
  });

  describe('getProgrammeForm', () => {
    it('should return form fields for a programme', async () => {
      const programmeId = 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1';
      const expectedResult = {
        message: 'Form fields fetched successfully',
        data: [
          {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            programme_id: programmeId,
            label: 'Full Name',
            type: 'text',
            required: true,
            options: null,
            created_at: new Date('2023-01-01'),
          },
          {
            id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
            programme_id: programmeId,
            label: 'Date of Birth',
            type: 'date',
            required: true,
            options: null,
            created_at: new Date('2023-01-01'),
          },
          {
            id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
            programme_id: programmeId,
            label: 'Area of Expertise',
            type: 'select',
            required: true,
            options: ['Technology', 'Arts', 'Science', 'Business'],
            created_at: new Date('2023-01-01'),
          },
        ],
        status: HttpStatus.OK,
      };

      mockFormfieldService.getProgrammeForm.mockResolvedValue(expectedResult);

      const result = await controller.getProgrammeForm(programmeId);

      expect(result).toEqual(expectedResult);
      expect(mockFormfieldService.getProgrammeForm).toHaveBeenCalledWith(
        programmeId,
      );
      expect(mockFormfieldService.getProgrammeForm).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when programme has no form fields', async () => {
      const programmeId = 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1';
      const expectedResult = {
        message: 'Form fields fetched successfully',
        data: [],
        status: HttpStatus.OK,
      };

      mockFormfieldService.getProgrammeForm.mockResolvedValue(expectedResult);

      const result = await controller.getProgrammeForm(programmeId);

      expect(result).toEqual(expectedResult);
      expect(result.data).toHaveLength(0);
    });
  });
});
