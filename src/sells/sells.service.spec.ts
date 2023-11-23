import { Test, TestingModule } from '@nestjs/testing';
import { SellsService } from './sells.service';

describe('SellsService', () => {
  let service: SellsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellsService],
    }).compile();

    service = module.get<SellsService>(SellsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
