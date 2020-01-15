import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { IndexBasicService } from '../index-basic/index-basic.service';
import { IndexDailyService } from '../index-daily/index-daily.service';
import { StockBasicService } from '../stock-basic/stock-basic.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const indexBasicService = app.get(IndexBasicService);
  const indexDailyService = app.get(IndexDailyService);
  const stockBasicService = app.get(StockBasicService);

  try {
    await Promise.all([
      indexBasicService.loadData(),
      indexDailyService.loadData('000001.SH'),
      stockBasicService.loadData(),
    ]);
  } finally {
    await app.close();
  }
}

bootstrap().then(() => {
  Logger.log('all done');
});
