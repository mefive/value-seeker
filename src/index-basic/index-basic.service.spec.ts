import { Test, TestingModule } from '@nestjs/testing';
import { IndexBasicService } from './index-basic.service';

describe('IndexBasicService', () => {
  let service: IndexBasicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndexBasicService],
    }).compile();

    service = module.get<IndexBasicService>(IndexBasicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
