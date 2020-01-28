import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { FinaIndicatorService } from '../fina-indicator/fina-indicator.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const finaIndicatorService = app.get(FinaIndicatorService);

  try {
    await finaIndicatorService.loadData();
  } finally {
    await app.close();
  }
}

bootstrap().then(() => {
  Logger.log('Loading fina all done');
});
