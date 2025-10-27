import { Test, TestingModule } from '@nestjs/testing';
import { FormfieldService } from './formfield.service';

describe('FormfieldService', () => {
  let service: FormfieldService;

  const mockDrizzleDb = {
    query: {
      formFieldSchema: {
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
        FormfieldService,
        {
          provide: 'DRIZZLE',
          useValue: mockDrizzleDb,
        },
      ],
    }).compile();

    service = module.get<FormfieldService>(FormfieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
