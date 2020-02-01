import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DailyBasicService } from '../daily-basic/daily-basic.service';
import { AssetType } from '../enums';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dailyBasicService = app.get(DailyBasicService);
  try {
    await dailyBasicService.loadData('000001.SH', AssetType.INDEX);
    await dailyBasicService.loadAllStocks();
  } finally {
    await app.close();
  }
}

bootstrap().then(() => {
  Logger.log('下载每日指标数据');
});
