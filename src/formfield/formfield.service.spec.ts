import { Test, TestingModule } from '@nestjs/testing';
import { FormfieldService } from './formfield.service';

describe('FormfieldService', () => {
  let service: FormfieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormfieldService],
    }).compile();

    service = module.get<FormfieldService>(FormfieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
