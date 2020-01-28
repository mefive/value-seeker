import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyEntity } from '../daily/daily.entity';
import { DividendEntity } from '../dividend/dividend.entity';
import { FinaIndicatorEntity } from '../fina-indicator/fina-indicator.entity';
import { StockBasicEntity } from '../stock-basic/stock-basic.entity';
import { TradeCalEntity } from '../trade-cal/trade-cal.entity';
import { QhStockCollectService } from './qh-stock-collect.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockBasicEntity,
      FinaIndicatorEntity,
      DividendEntity,
      DailyEntity,
      TradeCalEntity,
    ]),
  ],
  providers: [QhStockCollectService],
})
export class QhStockCollectModule {}
