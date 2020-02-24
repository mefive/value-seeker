import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { FinaIndicatorService } from '../fina-indicator/fina-indicator.service';

export default async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  const finaIndicatorService = app.get(FinaIndicatorService);

  try {
    await finaIndicatorService.loadData();
    Logger.log('下载 fina 财报成功');
  } finally {
    await app.close();
  }
};
