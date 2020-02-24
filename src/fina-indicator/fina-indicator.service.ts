import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull, Not, Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import delay from '../utils/delay';
import { tushare } from '../utils/tushare';
import { FinaIndicatorEntity } from './fina-indicator.entity';

@Injectable()
export class FinaIndicatorService extends BaseService {
  constructor(
    @InjectRepository(FinaIndicatorEntity)
    private readonly finaIndicatorRepository: Repository<FinaIndicatorEntity>,

    @InjectRepository(StockBasicEntity)
    private readonly stockBasicRepository: Repository<StockBasicEntity>,
  ) {
    super();
  }

  async loadData() {
    await this.finaIndicatorRepository.clear();

    const allStocks = await this.stockBasicRepository.find();

    const size = 80;

    for (let page = 0; page < Math.ceil(allStocks.length / size); page++) {
      let finaIndicatorList: FinaIndicatorEntity[] = [];

      for (let i = 0; i < size; i++) {
        const stock = allStocks[page * size + i];

        if (stock) {
          const response = await tushare<FinaIndicatorEntity[]>(
            'fina_indicator',
            {
              tsCode: stock.tsCode,
            },
          );

          Logger.log(`${stock.name} ${stock.tsCode} 下载成功`);

          finaIndicatorList = finaIndicatorList.concat(response.data);
        }
      }

      Logger.log(`批量插入第 ${page} 页`);

      await this.finaIndicatorRepository.insert(finaIndicatorList);

      await delay(60 * 1000);
    }

    Logger.log('财务指标数据下载完毕');
  }
}
