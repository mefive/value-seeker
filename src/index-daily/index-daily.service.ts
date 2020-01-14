import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { dateFormatString } from '../constants';
import { batchInsert } from '../utils/query';
import { tushare } from '../utils/tushare';
import { IndexDailyEntity } from './index-daily.entity';
import moment = require('moment');

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
      .findOne({ tsCode });

    const today = moment().format(dateFormatString);

    if (indexDaily && indexDaily.tradeDate === today) {
      return;
    }

    const resp = await tushare<IndexDailyEntity[]>('index_daily', {
      tsCode,
      startDate:
        indexDaily != null
          ? moment(indexDaily.tradeDate)
              .add(1, 'd')
              .format(dateFormatString)
          : moment()
              .subtract(10, 'y')
              .format(dateFormatString),
      endDate: today,
    });

    await batchInsert(IndexDailyEntity, resp.data);
  }
}
