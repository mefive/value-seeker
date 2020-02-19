import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import * as _ from 'lodash';
import * as moment from 'moment';
import { sma } from 'technicalindicators';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { DailyBasicEntity } from '../daily-basic/daily-basic.entity';
import { AssetType } from '../enums';
import { IndexBasicEntity } from '../index-basic/index-basic.entity';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import delay from '../utils/delay';
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

    @InjectRepository(IndexBasicEntity)
    private readonly indexBasicRepository: Repository<IndexBasicEntity>,
  ) {
    super();
  }

  async findAll(params: { tsCode: string }): Promise<DailyBasicEntity[]> {
    const { tsCode } = params;
    return await this.dailyRepository.find({
      where: {
        tsCode,
      },
      order: {
        tradeDate: 'DESC',
      },
    });
  }

  async loadAllStocks() {
    const allStocks = await this.stockBasicRepository.find({
      order: { listDate: 'ASC' },
    });

    // await this.dailyRepository.clear();

    const size = 200;

    for (let page = 0; page < Math.ceil(allStocks.length / size); page++) {
      let skip = true;

      for (let i = 0; i < size; i++) {
        const stock = allStocks[page * size + i];

        if (stock) {
          if (
            (await this.dailyRepository.findOne({ tsCode: stock.tsCode })) !=
            null
          ) {
            Logger.log(`${stock.name} ${stock.tsCode} 日交易数据已存在`);
            continue;
          }

          skip = false;

          await this.loadData(stock.tsCode, AssetType.STOCK, false, stock.name);
        }
      }

      Logger.log(`第 ${page} 页日交易数据保存成功`);

      if (!skip) {
        await delay(60 * 1000);
      }
    }

    Logger.log(`全部日交易数据保存成功`);
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
    assetType: AssetType,
    deleteFirst: boolean,
    name?: string,
  ): Promise<DailyEntity[] | null> {
    if (tsCode == null) {
      return null;
    }

    if (deleteFirst) {
      await this.dailyRepository.delete({ tsCode });
    }

    const codeName = `${name ? `${name} ` : ''}${tsCode}`;

    const tasks: Array<Promise<any>> = [
      tushare<DailyEntity[]>(
        assetType === AssetType.INDEX ? 'index_daily' : 'daily',
        {
          tsCode,
        },
      ),
    ];

    if (assetType === AssetType.STOCK) {
      tasks.push(
        tushare<Array<{ adjFactor: number }>>('adj_factor', {
          tsCode,
        }),
      );
    }

    const [dailyResponse, adjFactorResponse] = (await Promise.all(tasks)) as [
      AxiosResponse<DailyEntity[]>,
      AxiosResponse<Array<{ adjFactor: number }>> | undefined,
    ];

    if (dailyResponse.data.length === 0) {
      Logger.log(`${codeName} 没有数据`);
      return null;
    }

    const minLength = Math.min(
      dailyResponse.data.length,
      adjFactorResponse
        ? adjFactorResponse.data.length
        : dailyResponse.data.length,
    );

    const dailyList = dailyResponse.data.reverse().slice(-minLength);
    const adjFactorDataList = adjFactorResponse?.data
      .reverse()
      .slice(-minLength);
    const lastAdjFactorData = adjFactorDataList?.slice(-1)[0];

    for (let i = 0; i < dailyList.length; i++) {
      const daily = dailyList[i];

      if (assetType === AssetType.STOCK && lastAdjFactorData != null) {
        const adjFactorData = adjFactorDataList![i];
        // 前复权算法
        const multiplier =
          adjFactorData.adjFactor / lastAdjFactorData!.adjFactor;

        daily.open = +(daily.open * multiplier).toFixed(3);
        daily.close = +(daily.close * multiplier).toFixed(3);
        daily.low = +(daily.low * multiplier).toFixed(3);
        daily.high = +(daily.high * multiplier).toFixed(3);
      }

      daily.tradeDate = moment(daily.tradeDate).toDate();

      daily.rsv = rsv([
        ..._.range(1, 9)
          .map((r) => dailyList[i - r])
          .reverse(),
        daily,
      ]);

      const last = dailyList[i - 1];

      daily.k = last && daily.rsv ? (2 / 3) * last.k + (1 / 3) * daily.rsv : 50;
      daily.d = last ? (2 / 3) * last.d + (1 / 3) * daily.k : 50;
      daily.j = 3 * daily.k - 2 * daily.d;
      daily.ma5 = this.getSma(dailyList, i, 5);
      daily.ma10 = this.getSma(dailyList, i, 10);
      daily.ma20 = this.getSma(dailyList, i, 20);
      daily.ma90 = this.getSma(dailyList, i, 90);
    }

    Logger.log(`插入 daily，${tsCode}`);

    const task: Array<Promise<any>> = [this.dailyRepository.insert(dailyList)];

    const startDate = new Date(+moment(dailyList[0].tradeDate));
    const endDate = new Date(
      +moment(dailyList[dailyList.length - 1].tradeDate),
    );

    if (assetType === AssetType.STOCK) {
      // 用第一个实际交易日，更新 stock basic 的 start date，因为 list date 可能不准
      task.push(
        this.stockBasicRepository.update({ tsCode }, { startDate, endDate }),
      );
    } else {
      task.push(
        this.indexBasicRepository.update({ tsCode }, { startDate, endDate }),
      );
    }

    await Promise.all(task);

    return dailyList;
  }
}
