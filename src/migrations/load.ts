import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { IndexBasicService } from '../index-basic/index-basic.service';
import { IndexDailyService } from '../index-daily/index-daily.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const indexBasicService = app.get(IndexBasicService);
  const indexDailyService = app.get(IndexDailyService);

  try {
    // await indexBasicService.loadData();
    await indexDailyService.loadData('000001.SH');
    // await indexDailyService.clearData('000001.SH');
  } finally {
    await app.close();
  }
}

bootstrap().then(() => {
  Logger.log('all done');
});
