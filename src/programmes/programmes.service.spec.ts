import { Test, TestingModule } from '@nestjs/testing';
import { ProgrammesService } from './programmes.service';

describe('ProgrammesService', () => {
  let service: ProgrammesService;

  const mockDrizzleDb = {
    query: {
      programmesSchema: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    },
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgrammesService,
        {
          provide: 'DRIZZLE',
          useValue: mockDrizzleDb,
        },
      ],
    }).compile();

    service = module.get<ProgrammesService>(ProgrammesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
