import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyEntity } from '../daily/daily.entity';
import { QhBuyDateEntity } from './qh-buy-date.entity';
import { QhBuyDateService } from './qh-buy-date.service';

@Module({
  imports: [TypeOrmModule.forFeature([QhBuyDateEntity, DailyEntity])],
  providers: [QhBuyDateService],
})
export class QhBuyDateModule {}
