import { Test, TestingModule } from '@nestjs/testing';
import { AmethystService } from './amethyst.service';

describe('AmethystService', () => {
  let service: AmethystService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmethystService],
    }).compile();

    service = module.get<AmethystService>(AmethystService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
