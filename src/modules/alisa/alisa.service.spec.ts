import { Test, TestingModule } from '@nestjs/testing';
import { AlisaService } from './alisa.service';

describe('AlisaService', () => {
  let service: AlisaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlisaService],
    }).compile();

    service = module.get<AlisaService>(AlisaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
