import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getConnection } from 'typeorm';
import { AppModule } from '../app.module';
import { DailyService } from '../daily/daily.service';
import { AssetType } from '../enums';
import { IndexBasicEntity } from '../index-basic/index-basic.entity';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import delay from '../utils/delay';
import moment = require('moment');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dailyService = app.get(DailyService);

  try {
    const index = await getConnection()
      .getRepository(IndexBasicEntity)
      .findOne({ tsCode: '000001.SH' });

    await dailyService.loadData(
      index?.tsCode,
      moment(index?.listDate),
      AssetType.INDEX,
    );

    const size = 50;

    for (let i = 0; i < 5; i++) {
      const stockBasicList = await getConnection()
        .getRepository(StockBasicEntity)
        .find({ skip: i * size, take: size });

      await Promise.all(
        stockBasicList.map((stockBasic) =>
          dailyService.loadData(
            stockBasic.tsCode,
            moment(stockBasic.listDate),
            AssetType.STOCK,
          ),
        ),
      );

      await delay(2000);
    }
  } finally {
    app.close();
  }
}

bootstrap().then(() => {
  Logger.log('Loading daily all done');
});
