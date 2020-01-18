import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { tushare } from '../utils/tushare';
import { IndexBasicEntity } from './index-basic.entity';

@Injectable()
export class IndexBasicService extends BaseService {
  constructor(
    @InjectRepository(IndexBasicEntity)
    private readonly indexBasicRepository: Repository<IndexBasicEntity>,
  ) {
    super();
  }

  async loadData() {
    const resp = await tushare<IndexBasicEntity[]>('index_basic', {
      market: 'SSE',
    });

    await this.indexBasicRepository.delete({ market: 'SSE' });

    await this.indexBasicRepository.insert(resp.data);
  }
}
