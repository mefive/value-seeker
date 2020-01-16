import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getConnection } from 'typeorm';
import { AppModule } from '../app.module';
import { QhBuyDateService } from '../qh-buy-date/qh-buy-date.service';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import delay from '../utils/delay';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const qhBuyDateService = app.get(QhBuyDateService);
  try {
    await qhBuyDateService.run('000001.SH');

    const size = 50;

    for (let i = 0; i < 2; i++) {
      const stockBasicList = await getConnection()
        .getRepository(StockBasicEntity)
        .find({ skip: i * size, take: size });

      await Promise.all(
        stockBasicList.map((stockBasic) =>
          qhBuyDateService.run(stockBasic.tsCode),
        ),
      );

      await delay(200);
    }
  } finally {
    app.close();
  }
}

bootstrap().then(() => {
  Logger.log('Buy date all done');
});
