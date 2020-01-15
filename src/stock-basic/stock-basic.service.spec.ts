import { Test, TestingModule } from '@nestjs/testing';
import { StockBasicService } from './stock-basic.service';

describe('StockBasicService', () => {
  let service: StockBasicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockBasicService],
    }).compile();

    service = module.get<StockBasicService>(StockBasicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
