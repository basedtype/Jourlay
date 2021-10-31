import { Test, TestingModule } from '@nestjs/testing';
import { EgsService } from './egs.service';

describe('EgsService', () => {
  let service: EgsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EgsService],
    }).compile();

    service = module.get<EgsService>(EgsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
