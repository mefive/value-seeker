import { Module } from '@nestjs/common';
import { QhBuyDateService } from './qh-buy-date.service';

@Module({
  providers: [QhBuyDateService]
})
export class QhBuyDateModule {}
