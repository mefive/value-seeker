import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DividendService } from '../dividend/dividend.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dividendService = app.get(DividendService);

  try {
    await dividendService.loadData();
  } finally {
    await app.close();
  }
}

bootstrap().then(() => {
  Logger.log('分红送股下载完毕');
});
