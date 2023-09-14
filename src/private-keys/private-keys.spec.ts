import { Test, TestingModule } from '@nestjs/testing';
import { PrivateKey } from './private-keys';

describe('PrivateKeys', () => {
  let provider: PrivateKey;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrivateKey],
    }).compile();

    provider = module.get<PrivateKey>(PrivateKey);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
