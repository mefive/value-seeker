import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  const indexBasicRepository = app.get(
    getRepositoryToken(IndexBasicEntity),
  ) as Repository<IndexBasicEntity>;

  const stockBasicRepository = app.get(
    getRepositoryToken(StockBasicEntity),
  ) as Repository<StockBasicEntity>;

  try {
    const index = await indexBasicRepository.findOne({ tsCode: '000001.SH' });

    await dailyService.loadData(
      index?.tsCode,
      moment(index?.listDate),
      AssetType.INDEX,
    );

    const size = 100;
    const start = 15;

    for (let i = start; i < start + 2; i++) {
      const stockBasicList = await stockBasicRepository.find({
        skip: i * size,
        take: size,
      });

      await Promise.all(
        stockBasicList.map((stockBasic) =>
          dailyService.loadData(
            stockBasic.tsCode,
            moment(stockBasic.listDate),
            AssetType.STOCK,
          ),
        ),
      );

      await delay(200);
    }
  } finally {
    await app.close();
  }
}

bootstrap().then(() => {
  Logger.log('Loading daily all done');
});
