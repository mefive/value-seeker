import { Injectable, Logger } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { AssetType } from '../enums';
import { IndexDailyEntity } from '../index-daily/index-daily.entity';
import { QhBuyDateEntity } from './qh-buy-date.entity';

@Injectable()
export class QhBuyDateService {
  async run(tsCode: string, assetType: AssetType): Promise<QhBuyDateEntity[]> {
    if (assetType === AssetType.STOCK) {
      return [];
    }

    const dailyList = await getConnection()
      .getRepository(IndexDailyEntity)
      .find();

    for (let i = 0; i < dailyList.length; ) {

      i += 1;
    }

    Logger.log('count ' + dailyList.length);

    return [];
  }
}
