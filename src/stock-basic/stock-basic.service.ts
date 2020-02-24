import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { BaseService } from '../base/base.service';
import { IndexBasicEntity } from '../index-basic/index-basic.entity';
import { PagingRequest } from '../types';
import { tushare } from '../utils/tushare';
import { StockBasicEntity } from './stock-basic.entity';

@Injectable()
export class StockBasicService extends BaseService {
  constructor(
    @InjectRepository(StockBasicEntity)
    private readonly stockBasicRepository: Repository<StockBasicEntity>,
  ) {
    super();
  }

  async findAll(params: Partial<PagingRequest> & { tsCode?: string }) {
    const { start = 0, limit = 20 } = params;

    const where: Array<FindConditions<IndexBasicEntity>> = [{}];

    if (params.search) {
      const like = Like(`%${params.search}%`);
      where[0].tsCode = like;
      where.push({ name: like });
    }

    if (params.tsCode) {
      where[0].tsCode = params.tsCode;
    }

    const data = await this.stockBasicRepository.findAndCount({
      take: limit,
      skip: start,
      where,
      order: {
        tsCode: 'ASC',
      },
    });

    return { result: data[0], total: data[1] };
  }

  async loadData() {
    await this.stockBasicRepository.clear();
    const resp = await tushare<StockBasicEntity[]>('stock_basic');
    await this.stockBasicRepository.insert(resp.data);
  }
}
