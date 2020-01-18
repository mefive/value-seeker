import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
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

  async loadData() {
    const resp = await tushare<StockBasicEntity[]>('stock_basic');
    await this.stockBasicRepository.delete({ tsCode: Not(IsNull()) });
    await this.stockBasicRepository.insert(resp.data);
  }
}
