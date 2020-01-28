import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import { FinaIndicatorEntity } from './fina-indicator.entity';
import { FinaIndicatorService } from './fina-indicator.service';

@Module({
  imports: [TypeOrmModule.forFeature([FinaIndicatorEntity, StockBasicEntity])],
  providers: [FinaIndicatorService],
})
export class FinaIndicatorModule {}
