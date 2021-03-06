import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { DailyEntity } from '../daily/daily.entity';
import { QhBuyDateEntity } from './qh-buy-date.entity';

@Injectable()
export class QhBuyDateService extends BaseService {
  constructor(
    @InjectRepository(DailyEntity)
    private readonly dailyRepository: Repository<DailyEntity>,

    @InjectRepository(QhBuyDateEntity)
    private readonly qhBuyDateRepository: Repository<QhBuyDateEntity>,
  ) {
    super();
  }

  async run(
    tsCode: string,
    period: number = 10,
  ): Promise<Array<Omit<QhBuyDateEntity, 'id'>>> {
    const dailyList = await this.dailyRepository.find({
      where: { tsCode },
      order: { tradeDate: 'ASC' },
    });

    const buyDateList: Date[][] = [];

    const { length } = dailyList;

    for (let i = 0; i < length; i += 1) {
      if (i < period) {
        continue;
      }

      if (length - 1 - i < 21) {
        break;
      }

      const daily = dailyList[i];

      // 期间是变量，默认是 10
      if (
        dailyList[i - period].close > daily.close &&
        dailyList[i + 1].close < daily.high
      ) {
        // 条件一：期间起始日收盘价高于当日收盘价
        // 条件二：次日收盘价小于当日最高价
        // 条件三：未来 8 至 21 天收盘价格均小于当日最高价

        if (_.range(8, 21).every((f) => dailyList[i + f].close < daily.high)) {
          // 条件四：未来 21 天 KDJ 值的 J 小于 20
          const kdjDaily = dailyList[i + 21];

          if (kdjDaily.j < 20) {
            buyDateList.push([daily.tradeDate, kdjDaily.tradeDate]);
          }
        }
      }
    }

    buyDateList.forEach(([targetDate, alertDate]) => {
      Logger.log(`${tsCode} 命中日期：${targetDate}，报警日期：${alertDate}`);
    });

    return buyDateList.map(([targetDate, alertDate]) => ({
      tsCode,
      period,
      targetDate,
      alertDate,
    }));
  }
}
