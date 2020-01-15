import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { dateFormatString } from '../constants';
import { rsv } from '../utils/indicators';
import { batchInsert } from '../utils/query';
import { tushare } from '../utils/tushare';
import { IndexDailyEntity } from './index-daily.entity';
import moment = require('moment');
import * as _ from 'lodash';

@Injectable()
export class IndexDailyService {
  async clearData(tsCode: string) {
    await getConnection()
      .getRepository(IndexDailyEntity)
      .delete({ tsCode });
  }

  async loadData(tsCode: string) {
    const indexDaily = await getConnection()
      .getRepository(IndexDailyEntity)
      .delete({ tsCode });

    const resp = await tushare<IndexDailyEntity[]>('index_daily', {
      tsCode,
      startDate: moment()
        .subtract(1, 'year')
        .format(dateFormatString),
      endDate: moment().format(dateFormatString),
    });

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

    await batchInsert(IndexDailyEntity, list);
  }
}
