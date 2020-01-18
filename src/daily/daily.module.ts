import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import { DailyEntity } from './daily.entity';
import { DailyService } from './daily.service';

@Module({
  imports: [TypeOrmModule.forFeature([DailyEntity, StockBasicEntity])],
  providers: [DailyService],
})
export class DailyModule {}
