import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexBasicEntity } from '../index-basic/index-basic.entity';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import { DailyEntity } from './daily.entity';
import { DailyService } from './daily.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyEntity, StockBasicEntity, IndexBasicEntity]),
  ],
  providers: [DailyService],
})
export class DailyModule {}
