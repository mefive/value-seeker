import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndexBasicModule } from './index-basic/index-basic.module';
import { DailyModule } from './daily/daily.module';
import { QhBuyDateModule } from './qh-buy-date/qh-buy-date.module';
import { StockBasicModule } from './stock-basic/stock-basic.module';
import { TradeCalModule } from './trade-cal/trade-cal.module';
import { FinaIndicatorModule } from './fina-indicator/fina-indicator.module';
import { QhStockCollectModule } from './qh-stock-collect/qh-stock-collect.module';
import { DividendModule } from './dividend/dividend.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    IndexBasicModule,
    Logger,
    DailyModule,
    QhBuyDateModule,
    StockBasicModule,
    TradeCalModule,
    FinaIndicatorModule,
    QhStockCollectModule,
    DividendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
