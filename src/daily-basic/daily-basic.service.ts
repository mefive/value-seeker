import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { AssetType } from '../enums';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import delay from '../utils/delay';
import { tushare } from '../utils/tushare';
import { DailyBasicEntity } from './daily-basic.entity';

@Injectable()
export class DailyBasicService extends BaseService {
  constructor(
    @InjectRepository(StockBasicEntity)
    private readonly stockBasicRepository: Repository<StockBasicEntity>,

    @InjectRepository(DailyBasicEntity)
    private readonly dailyBasicRepository: Repository<DailyBasicEntity>,
  ) {
    super();
  }

  async findAll(params: { tsCode: string }): Promise<DailyBasicEntity[]> {
    const { tsCode } = params;
    return await this.dailyBasicRepository.find({
      where: {
        tsCode,
      },
      order: {
        tradeDate: 'DESC',
      },
    });
  }

  async loadAllStocks(date: string) {
    const allStocks = await this.stockBasicRepository.find({
      order: { tsCode: 'DESC' },
    });

    if (date) {
      const exist = await this.dailyBasicRepository.findOne({
        tradeDate: moment(date).toDate(),
      });

      if (exist == null) {
        await this.dailyBasicRepository.clear();
      }
    } else {
      await this.dailyBasicRepository.clear();
    }

    const size = 200;

    for (let page = 0; page < Math.ceil(allStocks.length / size); page++) {
      let skip = true;

      for (let i = 0; i < size; i++) {
        const stock = allStocks[page * size + i];

        if (stock) {
          if (
            (await this.dailyBasicRepository.findOne({
              where: { tsCode: stock.tsCode },
            })) != null
          ) {
            Logger.log(`${stock.name} ${stock.tsCode} 每日指标已存在`);
            continue;
          }

          skip = false;

          await this.loadData(stock.tsCode, AssetType.STOCK, stock.name);
        }
      }

      Logger.log(`第 ${page} 页每日指标保存成功`);

      if (!skip) {
        await delay(60 * 1000);
      }
    }

    Logger.log(`全部每日指标保存成功`);
  }

  async loadData(
    tsCode: string,
    assetType: AssetType,
    name?: string,
  ): Promise<DailyBasicEntity[] | null> {
    if (tsCode == null) {
      return null;
    }

    const codeName = `${name ? `${name} ` : ''}${tsCode}`;

    await this.dailyBasicRepository.delete({ tsCode });

    const response = await tushare<DailyBasicEntity[]>(
      assetType === AssetType.INDEX ? 'index_dailybasic' : 'daily_basic',
      {
        tsCode,
      },
    );

    if (response.data.length === 0) {
      Logger.log(`${codeName} 每日指标无数据`);
      return null;
    }

    const dailyBasicList =
      assetType === AssetType.INDEX
        ? response.data.map((d) =>
            _.omit(d, ['totalShare', 'totalMv', 'floatShare']),
          )
        : response.data;

    await this.dailyBasicRepository.insert(dailyBasicList);

    return dailyBasicList;
  }
}
