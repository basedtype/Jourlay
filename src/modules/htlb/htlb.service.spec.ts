import { Test, TestingModule } from '@nestjs/testing';
import { HtlbService } from './htlb.service';

describe('HtlbService', () => {
  let service: HtlbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HtlbService],
    }).compile();

    service = module.get<HtlbService>(HtlbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
