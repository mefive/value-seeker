import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TradeCalService } from '../trade-cal/trade-cal.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tradeCalService = app.get(TradeCalService);
  try {
    await tradeCalService.loadData();
  } finally {
    await app.close();
  }
}

bootstrap().then(() => {
  Logger.log('Loading cal all done');
});
