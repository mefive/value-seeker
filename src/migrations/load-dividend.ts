import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DividendService } from '../dividend/dividend.service';

export default async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dividendService = app.get(DividendService);

  try {
    await dividendService.loadData();
    Logger.log('下载 dividend 分红送股成功');
  } finally {
    await app.close();
  }
};
