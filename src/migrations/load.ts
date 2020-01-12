import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { IndexBasicService } from '../index-basic/index-basic.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const indexBasicService = app.get(IndexBasicService);
  try {
    await indexBasicService.loadData();
  } finally {
    await app.close();
  }
}

bootstrap().then(() => {
  Logger.log('all done');
});
