import { Test, TestingModule } from '@nestjs/testing';
import { SellsController } from './sells.controller';

describe('SellsController', () => {
  let controller: SellsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellsController],
    }).compile();

    controller = module.get<SellsController>(SellsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
