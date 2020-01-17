import { Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { Moment } from 'moment';
import { getConnection } from 'typeorm';
import { dateFormatString } from '../constants';
import { AssetType } from '../enums';
import { rsv } from '../utils/indicators';
import { batchInsert } from '../utils/query';
import { tushare } from '../utils/tushare';
import { DailyEntity } from './daily.entity';
import moment = require('moment');

@Injectable()
export class DailyService {
  async loadData(
    tsCode: string | null = null,
    startDate: Moment,
    assetType: AssetType,
  ) {
    if (tsCode == null) {
      return;
    }

    const today = moment();

    const dailyList = await getConnection()
      .getRepository(DailyEntity)
      .find({ where: { tsCode }, take: 1, order: { tradeDate: 'DESC' } });

    if (dailyList[0] && moment(dailyList[0].tradeDate).isSame(today.clone().subtract(1, 'd'), 'd')) {
      Logger.log(`${tsCode} 无需更新`);
      return;
    }

    const resp = await tushare<DailyEntity[]>(
      assetType === AssetType.INDEX ? 'index_daily' : 'daily',
      {
        tsCode,
        startDate:
          dailyList.length > 0
            ? today.format(dateFormatString)
            : startDate.format(dateFormatString),
        endDate: today.format(dateFormatString),
      },
    );

    if (resp.data.length === 0) {
      Logger.log(`${tsCode}没有数据`);
      return;
    }

    const list = _.sortBy(resp.data, (d) => d.tradeDate);

    for (let i = 0; i < list.length; i++) {
      const daily = list[i];

      daily.tradeDate = moment(daily.tradeDate).toDate();

      daily.rsv = rsv(
        _.range(9)
          .map((r) => list[i - r])
          .reverse(),
      );

      const last = list[i - 1];

      daily.k = last && daily.rsv ? (2 / 3) * last.k + (1 / 3) * daily.rsv : 50;
      daily.d = last ? (2 / 3) * last.d + (1 / 3) * daily.k : 50;
      daily.j = 3 * daily.k - 2 * daily.d;
    }

    Logger.log(`插入 daily，${tsCode}`);

    await batchInsert(DailyEntity, list);
  }
}
