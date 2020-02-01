import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import { DailyBasicController } from './daily-basic.controller';
import { DailyBasicEntity } from './daily-basic.entity';
import { DailyBasicService } from './daily-basic.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockBasicEntity, DailyBasicEntity])],
  providers: [DailyBasicService],
  controllers: [DailyBasicController],
})
export class DailyBasicModule {}
