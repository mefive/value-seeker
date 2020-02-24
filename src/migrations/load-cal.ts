import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TradeCalService } from '../trade-cal/trade-cal.service';

export default async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tradeCalService = app.get(TradeCalService);
  try {
    await tradeCalService.loadData();
    Logger.log('下载 cal 成功');
  } finally {
    await app.close();
  }
};
