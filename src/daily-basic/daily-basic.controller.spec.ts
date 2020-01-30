import { Test, TestingModule } from '@nestjs/testing';
import { DailyBasicController } from './daily-basic.controller';

describe('DailyBasic Controller', () => {
  let controller: DailyBasicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyBasicController],
    }).compile();

    controller = module.get<DailyBasicController>(DailyBasicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
