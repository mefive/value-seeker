import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AssetType } from '../enums';
import { QhBuyDateService } from '../qh-buy-date/qh-buy-date.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const qhBuyDateService = app.get(QhBuyDateService);
  try {
    await qhBuyDateService.run('000001.SH', AssetType.INDEX);
  } finally {
    app.close();
  }
}

bootstrap().then(() => {
  Logger.log('Buy date all done');
});
