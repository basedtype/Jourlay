import { Test, TestingModule } from '@nestjs/testing';
import { WallhavenService } from './wallhaven.service';

describe('WallhavenService', () => {
  let service: WallhavenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WallhavenService],
    }).compile();

    service = module.get<WallhavenService>(WallhavenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
