import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { IndexBasicService } from '../index-basic/index-basic.service';
import { StockBasicService } from '../stock-basic/stock-basic.service';

export default async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const indexBasicService = app.get(IndexBasicService);
  const stockBasicService = app.get(StockBasicService);

  try {
    await Promise.all([
      indexBasicService.loadData('SSE'),
      stockBasicService.loadData(),
    ]);
    Logger.log('下载 daily basic 成功');
  } finally {
    await app.close();
  }
};
