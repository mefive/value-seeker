import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DailyService } from '../daily/daily.service';
import { AssetType } from '../enums';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dailyService = app.get(DailyService);
  try {
    await dailyService.loadData('000001.SH', AssetType.INDEX);
    await dailyService.loadAllStocks();
  } finally {
    await app.close();
  }
}

bootstrap().then(() => {
  Logger.log('下载日交易数据');
});
