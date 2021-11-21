import { Test, TestingModule } from '@nestjs/testing';
import { AlisaController } from './alisa.controller';

describe('AlisaController', () => {
  let controller: AlisaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlisaController],
    }).compile();

    controller = module.get<AlisaController>(AlisaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
