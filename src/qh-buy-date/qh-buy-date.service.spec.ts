import { Test, TestingModule } from '@nestjs/testing';
import { QhBuyDateService } from './qh-buy-date.service';

describe('QhBuyDateService', () => {
  let service: QhBuyDateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QhBuyDateService],
    }).compile();

    service = module.get<QhBuyDateService>(QhBuyDateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
