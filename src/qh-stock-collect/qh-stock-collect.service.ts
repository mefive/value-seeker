import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import * as moment from 'moment';
import { In, LessThan, Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { DailyEntity } from '../daily/daily.entity';
import { DividendEntity } from '../dividend/dividend.entity';
import { FinaIndicatorEntity } from '../fina-indicator/fina-indicator.entity';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import { TradeCalEntity } from '../trade-cal/trade-cal.entity';

@Injectable()
export class QhStockCollectService extends BaseService {
  constructor(
    @InjectRepository(FinaIndicatorEntity)
    private readonly finaIndicatorRepository: Repository<FinaIndicatorEntity>,

    @InjectRepository(DividendEntity)
    private readonly dividendRepository: Repository<DividendEntity>,

    @InjectRepository(DailyEntity)
    private readonly dailyRepository: Repository<DailyEntity>,

    @InjectRepository(TradeCalEntity)
    private readonly tradeCalRepository: Repository<TradeCalEntity>,

    @InjectRepository(StockBasicEntity)
    private readonly stockBasicRepository: Repository<StockBasicEntity>,
  ) {
    super();
  }

  async run(date: Date): Promise<StockBasicEntity[]> {
    const periods = _.range(5).map((i) =>
      moment()
        .subtract(i + 1, 'y')
        .endOf('y')
        .format('YYYY-MM-DD'),
    );

    const finaIndicatorInPeriod = await this.finaIndicatorRepository.find({
      where: {
        endDate: In(periods),
      },
    });

    // 最近五年ROE不小于13
    const stocksHighRoe = Object.values(
      _.groupBy(finaIndicatorInPeriod, (f) => f.tsCode),
    )
      .filter((fl) => fl.every((f) => f.roe && f.roe >= 13))
      .map((fl) => fl[0].tsCode);

    if (stocksHighRoe.length === 0) {
      return [];
    }

    const dividendInPeriod = await this.dividendRepository.find({
      where: {
        tsCode: In(stocksHighRoe),
        endDate: In(periods),
      },
    });

    // 最近五年均有现金分红
    const stocksHasCashDividend = Object.values(
      _.groupBy(dividendInPeriod, (dv) => dv.tsCode),
    )
      .filter((dvl) => dvl.every((dv) => dv.cashDivTax != null))
      .map((dvl) => dvl[0].tsCode);

    if (stocksHasCashDividend.length === 0) {
      return [];
    }

    const tradeCal = await this.tradeCalRepository.findOne({
      where: {
        calDate: LessThan(moment(date).format('YYYY-MM-DD')),
      },
      order: {
        calDate: 'DESC',
      },
    });

    const dailyInStocksAndDate = await this.dailyRepository.find({
      where: {
        tsCode: In(stocksHasCashDividend),
        tradeDate: In([
          moment(tradeCal?.calDate).format('YYYY-MM-DD'),
          moment(date).format('YYYY-MM-DD'),
        ]),
      },
      order: {
        tsCode: 'DESC',
      },
    });

    if (dailyInStocksAndDate.length === 0) {
      return [];
    }

    const [last, current] = Object.values(
      _.groupBy(dailyInStocksAndDate, (d) => d.tradeDate),
    );

    // ma20 在 ma90 上方，且斜率向上
    const stocksBetterTech = current
      .filter((d, index) => {
        const lastOne = last[index];

        if (
          d.ma20 == null ||
          d.ma90 == null ||
          lastOne == null ||
          lastOne.ma20 == null ||
          lastOne.ma90 == null
        ) {
          return false;
        }

        return (
          d.ma20 >= d.ma90 && d.ma20 >= lastOne.ma20 && d.ma90 >= lastOne.ma90
        );
      })
      .map((d) => d.tsCode);

    if (stocksBetterTech.length === 0) {
      return [];
    }

    return this.stockBasicRepository.find({
      where: {
        tsCode: In(stocksBetterTech),
      },
    });
  }
}
