import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { QhBuyDateEntity } from '../qh-buy-date/qh-buy-date.entity';
import { QhBuyDateService } from '../qh-buy-date/qh-buy-date.service';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import delay from '../utils/delay';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const qhBuyDateService = app.get(QhBuyDateService);

  const qhBuyDateRepository = app.get(
    getRepositoryToken(QhBuyDateEntity),
  ) as Repository<QhBuyDateEntity>;

  const stockBasicRepository = app.get(
    getRepositoryToken(StockBasicEntity),
  ) as Repository<StockBasicEntity>;

  const period = 10;

  await qhBuyDateRepository.delete({ period });

  try {
    await qhBuyDateService.run('000001.SH', period);

    const size = 100;
    const page = 30;

    for (let i = 0; i < page; i++) {
      const stockBasicList = await stockBasicRepository.find({
        skip: i * size,
        take: size,
      });

      await Promise.all(
        stockBasicList.map((stockBasic) =>
          qhBuyDateService.run(stockBasic.tsCode, period),
        ),
      );
    }
  } finally {
    await app.close();
  }
}

bootstrap().then(() => {
  Logger.log('Buy date all done');
});
