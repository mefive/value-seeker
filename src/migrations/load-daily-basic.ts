import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DailyBasicService } from '../daily-basic/daily-basic.service';
import { AssetType } from '../enums';

export default async (date: string) => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dailyBasicService = app.get(DailyBasicService);
  try {
    await dailyBasicService.loadAllStocks(date);
    await dailyBasicService.loadData('000001.SH', AssetType.INDEX);
    Logger.log('下载每日指标数据');
  } finally {
    await app.close();
  }
};
