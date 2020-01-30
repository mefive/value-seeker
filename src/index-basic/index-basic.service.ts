import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { PagingRequest } from '../types';
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

  async findAll(params: Partial<PagingRequest> & { market?: string }) {
    const { market = 'SSE', start = 0, limit = 20 } = params;

    const data = await this.indexBasicRepository.findAndCount({
      where: {
        market,
      },
      take: limit,
      skip: start,
    });

    return { result: data[0], total: data[1] };
  }

  async findOne(id: string) {
    return await this.indexBasicRepository.findOneOrFail({ where: { id } });
  }

  async loadData(market: string = 'SSE') {
    const resp = await tushare<IndexBasicEntity[]>('index_basic', {
      market,
    });

    await this.indexBasicRepository.delete({ market });

    await this.indexBasicRepository.insert(
      resp.data.map((d) => ({
        ...d,
        market,
      })),
    );
  }
}
