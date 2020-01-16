import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { IndexBasicService } from '../index-basic/index-basic.service';
import { StockBasicService } from '../stock-basic/stock-basic.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const indexBasicService = app.get(IndexBasicService);
  const stockBasicService = app.get(StockBasicService);

  try {
    await Promise.all([
      indexBasicService.loadData(),
      stockBasicService.loadData(),
    ]);
  } finally {
    await app.close();
  }
}

bootstrap().then(() => {
  Logger.log('Loading basic all done');
});
