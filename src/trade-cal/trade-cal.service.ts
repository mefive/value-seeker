import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import { tushare } from '../utils/tushare';
import { TradeCalEntity } from './trade-cal.entity';
import moment = require('moment');

@Injectable()
export class TradeCalService extends BaseService {
  constructor(
    @InjectRepository(TradeCalEntity)
    private readonly tradeCalRepository: Repository<TradeCalEntity>,

    @InjectRepository(StockBasicEntity)
    private readonly stockBasicRepository: Repository<StockBasicEntity>,
  ) {
    super();
  }
  async loadData() {
    const tradeCalResponse = await tushare<
      Array<TradeCalEntity & { isOpen: boolean }>
    >('trade_cal');

    await this.tradeCalRepository.clear();

    const allStocks = await this.stockBasicRepository.find({
      where: {
        startDate: Not(IsNull()),
      },
      order: {
        startDate: 'ASC',
      },
    });

    let counter = 0;

    const tradeCalList: Array<Omit<
      TradeCalEntity,
      'id'
    >> = tradeCalResponse.data
      .filter((t) => t.isOpen)
      .map((t) => {
        const calDate = moment(t.calDate);

        while (counter < allStocks.length) {
          const stock = allStocks[counter];

          if (moment(stock.startDate).isSameOrBefore(calDate, 'day')) {
            counter++;
          } else {
            break;
          }
        }

        return {
          calDate: calDate.toDate(),
          total: counter,
        };
      });

    await this.tradeCalRepository.insert(tradeCalList);
  }
}
