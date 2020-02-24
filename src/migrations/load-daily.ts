import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DailyService } from '../daily/daily.service';
import { AssetType } from '../enums';

export default async (date: string) => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dailyService = app.get(DailyService);
  try {
    await dailyService.loadAllStocks(date);
    await dailyService.loadData('000001.SH', AssetType.INDEX, true);
  } finally {
    await app.close();
  }

  Logger.log('下载 daily 成功');
};
