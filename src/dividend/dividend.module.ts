import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import { DividendEntity } from './dividend.entity';
import { DividendService } from './dividend.service';

@Module({
  imports: [TypeOrmModule.forFeature([DividendEntity, StockBasicEntity])],
  providers: [DividendService],
})
export class DividendModule {}
