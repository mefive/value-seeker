import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import { TradeCalEntity } from './trade-cal.entity';
import { TradeCalService } from './trade-cal.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockBasicEntity, TradeCalEntity])],
  providers: [TradeCalService],
})
export class TradeCalModule {}
