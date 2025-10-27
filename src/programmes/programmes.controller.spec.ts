import { Test, TestingModule } from '@nestjs/testing';
import { ProgrammesController } from './programmes.controller';
import { ProgrammesService } from './programmes.service';
import { HttpStatus } from '@nestjs/common';
import { ProgrammeDto } from './dto/programme.dto';

describe('ProgrammesController', () => {
  let controller: ProgrammesController;
  let service: ProgrammesService;

  const mockProgrammesService = {
    createProgramme: jest.fn(),
    getAllProgrammes: jest.fn(),
    getProgrammeById: jest.fn(),
    getActiveProgrammes: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgrammesController],
      providers: [
        {
          provide: ProgrammesService,
          useValue: mockProgrammesService,
        },
      ],
    }).compile();

    controller = module.get<ProgrammesController>(ProgrammesController);
    service = module.get<ProgrammesService>(ProgrammesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProgramme', () => {
    it('should successfully create a new programme', async () => {
      const programmeDto: ProgrammeDto = {
        name: 'Youth Development Program',
        description: 'Learn new skills and gain experience',
        objectives: ['Learn new skills', 'Gain experience'],
        target_audience: ['Youth', 'Adults'],
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        isActive: true,
      };

      const expectedResult = {
        message: 'Programme created successfully',
        data: {
          id: 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1',
          ...programmeDto,
          created_at: new Date('2023-01-01'),
        },
        status: HttpStatus.CREATED,
      };

      mockProgrammesService.createProgramme.mockResolvedValue(expectedResult);

      const result = await controller.createProgramme(programmeDto);

      expect(result).toEqual(expectedResult);
      expect(mockProgrammesService.createProgramme).toHaveBeenCalledWith(
        programmeDto,
      );
      expect(mockProgrammesService.createProgramme).toHaveBeenCalledTimes(1);
    });

    it('should throw conflict error when programme already exists', async () => {
      const programmeDto: ProgrammeDto = {
        name: 'Youth Development Program',
        description: 'Learn new skills and gain experience',
        objectives: ['Learn new skills', 'Gain experience'],
        target_audience: ['Youth', 'Adults'],
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        isActive: true,
      };

      mockProgrammesService.createProgramme.mockRejectedValue({
        message: 'Programme already exists, please update it instead',
        statusCode: HttpStatus.CONFLICT,
      });

      await expect(controller.createProgramme(programmeDto)).rejects.toEqual({
        message: 'Programme already exists, please update it instead',
        statusCode: HttpStatus.CONFLICT,
      });
    });
  });

  describe('getAllProgrammes', () => {
    it('should return all programmes', async () => {
      const expectedResult = {
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
            created_at: new Date('2023-01-01'),
          },
        ],
        status: HttpStatus.OK,
      };

      mockProgrammesService.getAllProgrammes.mockResolvedValue(expectedResult);

      const result = await controller.getAllProgrammes();

      expect(result).toEqual(expectedResult);
      expect(mockProgrammesService.getAllProgrammes).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no programmes exist', async () => {
      const expectedResult = {
        message: 'All programmes fetched successfully',
        data: [],
        status: HttpStatus.OK,
      };

      mockProgrammesService.getAllProgrammes.mockResolvedValue(expectedResult);

      const result = await controller.getAllProgrammes();

      expect(result).toEqual(expectedResult);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('getActiveProgrammes', () => {
    it('should return all active programmes', async () => {
      const expectedResult = {
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
            created_at: new Date('2023-01-01'),
          },
        ],
        status: HttpStatus.OK,
      };

      mockProgrammesService.getActiveProgrammes.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getActiveProgrammes();

      expect(result).toEqual(expectedResult);
      expect(mockProgrammesService.getActiveProgrammes).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('getProgrammeById', () => {
    it('should return a programme by id', async () => {
      const programmeId = 'f43b86e7-d6ac-4b8d-8df5-7c4e7b3a83b1';
      const expectedResult = {
        message: 'Programme fetched successfully',
        data: {
          id: programmeId,
          name: 'Youth Development Program',
          description: 'Learn new skills and gain experience',
          objectives: ['Learn new skills', 'Gain experience'],
          target_audience: ['Youth', 'Adults'],
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          isActive: true,
          created_at: new Date('2023-01-01'),
        },
        status: HttpStatus.OK,
      };

      mockProgrammesService.getProgrammeById.mockResolvedValue(expectedResult);

      const result = await controller.getProgrammeById(programmeId);

      expect(result).toEqual(expectedResult);
      expect(mockProgrammesService.getProgrammeById).toHaveBeenCalledWith(
        programmeId,
      );
      expect(mockProgrammesService.getProgrammeById).toHaveBeenCalledTimes(1);
    });

    it('should throw not found error when programme does not exist', async () => {
      const programmeId = 'nonexistent-id';

      mockProgrammesService.getProgrammeById.mockRejectedValue({
        message: 'Programme not found',
        statusCode: HttpStatus.NOT_FOUND,
      });

      await expect(controller.getProgrammeById(programmeId)).rejects.toEqual({
        message: 'Programme not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });
});
