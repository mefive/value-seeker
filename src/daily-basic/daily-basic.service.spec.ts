import { Test, TestingModule } from '@nestjs/testing';
import { DailyBasicService } from './daily-basic.service';

describe('DailyBasicService', () => {
  let service: DailyBasicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyBasicService],
    }).compile();

    service = module.get<DailyBasicService>(DailyBasicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
