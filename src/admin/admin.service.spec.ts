import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { JwtService } from '@nestjs/jwt';

describe('AdminService', () => {
  let service: AdminService;

  const mockDrizzleDb = {
    query: {
      adminSchema: {
        findFirst: jest.fn(),
      },
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: 'DRIZZLE',
          useValue: mockDrizzleDb,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
