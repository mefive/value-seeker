import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { QhBuyDateEntity } from '../qh-buy-date/qh-buy-date.entity';
import { QhBuyDateService } from '../qh-buy-date/qh-buy-date.service';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const qhBuyDateService = app.get(QhBuyDateService);

  const qhBuyDateRepository = app.get(
    getRepositoryToken(QhBuyDateEntity),
  ) as Repository<QhBuyDateEntity>;

  const stockBasicRepository = app.get(
    getRepositoryToken(StockBasicEntity),
  ) as Repository<StockBasicEntity>;

  const period = 5;

  await qhBuyDateRepository.delete({ period });

  try {
    await qhBuyDateService.run('000001.SH', period);
    let qhBuyDateEntityList: Array<Omit<QhBuyDateEntity, 'id'>> = [];

    const size = 100;
    const totalPage = (await stockBasicRepository.count()) / size;

    let page = 0;

    while (page < totalPage) {
      const stockBasicList = await stockBasicRepository.find({
        skip: page * size,
        take: size,
      });

      for (const stockBasic of stockBasicList) {
        qhBuyDateEntityList = qhBuyDateEntityList.concat(
          await qhBuyDateService.run(stockBasic.tsCode, period),
        );
      }

      page++;
    }

    if (qhBuyDateEntityList.length > 0) {
      await qhBuyDateRepository.insert(qhBuyDateEntityList);
    }
  } finally {
    await app.close();
  }
}

bootstrap().then(() => {
  Logger.log('Buy date all done');
});
