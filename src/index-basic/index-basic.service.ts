import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, FindOneOptions } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';
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

  async findAll(
    params: Partial<PagingRequest> & { market?: string; tsCode?: string },
  ) {
    const { market = 'SSE', start = 0, limit = 20 } = params;

    const where: Array<FindConditions<IndexBasicEntity>> = [{ market }];

    if (params.search) {
      const like = Like(`%${params.search}%`);

      where[0].tsCode = like;
      where.push({ name: like });
    }

    if (params.tsCode) {
      where[0].tsCode = params.tsCode;
    }

    const data = await this.indexBasicRepository.findAndCount({
      where,
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
