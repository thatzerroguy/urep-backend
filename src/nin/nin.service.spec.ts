import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NinService } from './nin.service';

describe('NinService', () => {
  let service: NinService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        qoreIdClientID: 'test-client-id',
        qoreIdSecret: 'test-secret',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NinService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<NinService>(NinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
