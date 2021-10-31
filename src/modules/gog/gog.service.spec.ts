import { Test, TestingModule } from '@nestjs/testing';
import { GogService } from './gog.service';

describe('GogService', () => {
  let service: GogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GogService],
    }).compile();

    service = module.get<GogService>(GogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
