import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { QhStockCollectService } from '../qh-stock-collect/qh-stock-collect.service';
import moment = require('moment');
import * as _ from 'lodash';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const qhStockCollectService = app.get(QhStockCollectService);

  const date = moment('2018-09-12');

  try {
    const stocks = await qhStockCollectService.run(date.toDate());
    Logger.log(`${date.format('YYYY-MM-DD')} 筛选结果`);
    _.sortBy(stocks, (s) => s.tsCode).forEach((stock) => {
      Logger.log(`${stock.tsCode} ${stock.name}`);
    });
  } finally {
    app.close();
  }
}

bootstrap().then(() => {
  Logger.log('个股选择完毕');
});
