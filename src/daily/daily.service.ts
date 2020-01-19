import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import * as _ from 'lodash';
import * as moment from 'moment';
import { sma } from 'technicalindicators';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { dateFormatString } from '../constants';
import { AssetType } from '../enums';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import { rsv } from '../utils/indicators';
import { tushare } from '../utils/tushare';
import { DailyEntity } from './daily.entity';

@Injectable()
export class DailyService extends BaseService {
  constructor(
    @InjectRepository(DailyEntity)
    private readonly dailyRepository: Repository<DailyEntity>,

    @InjectRepository(StockBasicEntity)
    private readonly stockBasicRepository: Repository<StockBasicEntity>,
  ) {
    super();
  }

  private getSma(
    dailyList: DailyEntity[],
    index: number,
    period: number,
  ): number | undefined {
    const ma = sma({
      period,
      values: [
        ..._.range(1, period)
          .map((r) => dailyList[index - r]?.close)
          .reverse(),
        dailyList[index].close,
      ],
    })[0];
    return Number.isNaN(ma) ? undefined : ma;
  }

  async loadData(
    tsCode: string | null = null,
    startDate: moment.Moment,
    assetType: AssetType,
  ) {
    if (tsCode == null) {
      return;
    }

    const exist = await this.dailyRepository.findOne({
      where: { tsCode },
    });

    if (exist) {
      Logger.log(`${tsCode} 已存在`);
      return;
    }

    const startDateStr = startDate.format(dateFormatString);

    const tasks: Array<Promise<any>> = [
      tushare<DailyEntity[]>(
        assetType === AssetType.INDEX ? 'index_daily' : 'daily',
        {
          tsCode,
          startDate: startDateStr,
        },
      ),
    ];

    if (assetType === AssetType.STOCK) {
      tasks.push(
        tushare<Array<{ adjFactor: number }>>('adj_factor', {
          tsCode,
          startDate: startDateStr,
        }),
      );
    }

    const [dailyResponse, adjFactorResponse] = (await Promise.all(tasks)) as [
      AxiosResponse<DailyEntity[]>,
      AxiosResponse<Array<{ adjFactor: number }>> | undefined,
    ];

    if (dailyResponse.data.length === 0) {
      Logger.log(`${tsCode}没有数据`);
      return;
    }

    const dailyDataList = dailyResponse.data.reverse();
    const adjFactorDataList = adjFactorResponse?.data.reverse();
    const lastAdjFactorData = adjFactorDataList?.slice(-1)[0];

    for (let i = 0; i < dailyDataList.length; i++) {
      const daily = dailyDataList[i];

      if (assetType === AssetType.STOCK) {
        const adjFactorData = adjFactorDataList![i];
        // 前复权算法
        const multiplier =
          adjFactorData.adjFactor / lastAdjFactorData!.adjFactor;

        daily.close = +(daily.close * multiplier).toFixed(3);
        daily.low = +(daily.low * multiplier).toFixed(3);
        daily.high = +(daily.high * multiplier).toFixed(3);
      }

      daily.tradeDate = moment(daily.tradeDate).toDate();

      daily.rsv = rsv([
        ..._.range(1, 9)
          .map((r) => dailyDataList[i - r])
          .reverse(),
        daily,
      ]);

      const last = dailyDataList[i - 1];

      daily.k = last && daily.rsv ? (2 / 3) * last.k + (1 / 3) * daily.rsv : 50;
      daily.d = last ? (2 / 3) * last.d + (1 / 3) * daily.k : 50;
      daily.j = 3 * daily.k - 2 * daily.d;
      daily.ma5 = this.getSma(dailyDataList, i, 5);
      daily.ma10 = this.getSma(dailyDataList, i, 10);
      daily.ma20 = this.getSma(dailyDataList, i, 20);
      daily.ma90 = this.getSma(dailyDataList, i, 90);
    }

    Logger.log(`插入 daily，${tsCode}`);

    const task: Array<Promise<any>> = [
      this.dailyRepository.insert(dailyDataList),
    ];

    if (assetType === AssetType.STOCK) {
      // 用第一个实际交易日，更新 stock basic 的 start date，因为 list date 可能不准
      task.push(
        this.stockBasicRepository.update(
          { tsCode },
          {
            startDate: new Date(+moment(dailyDataList[0].tradeDate)),
          },
        ),
      );
    }

    await Promise.all(task);
  }
}
