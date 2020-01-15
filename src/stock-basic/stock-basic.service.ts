import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { batchInsert } from '../utils/query';
import { tushare } from '../utils/tushare';
import { StockBasicEntity } from './stock-basic.entity';

@Injectable()
export class StockBasicService extends BaseService {
  async loadData() {
    const resp = await tushare<StockBasicEntity[]>('stock_basic');
    await batchInsert(StockBasicEntity, resp.data);
  }
}
