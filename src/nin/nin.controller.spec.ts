import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NinController } from './nin.controller';
import { NinService } from './nin.service';
import { SmsService } from '../sms/sms.service';

describe('NinController', () => {
  let controller: NinController;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        qoreIdClientID: 'test-client-id',
        qoreIdSecret: 'test-secret',
      };
      return config[key];
    }),
  };

  const mockSmsService = {
    sendOtp: jest.fn(),
    verifyOtp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NinController],
      providers: [
        NinService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: SmsService,
          useValue: mockSmsService,
        },
      ],
    }).compile();

    controller = module.get<NinController>(NinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
