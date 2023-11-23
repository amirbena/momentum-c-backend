import { Test, TestingModule } from '@nestjs/testing';
import { SchedualingService } from './schedualing.service';

describe('SchedualingService', () => {
  let service: SchedualingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedualingService],
    }).compile();

    service = module.get<SchedualingService>(SchedualingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
