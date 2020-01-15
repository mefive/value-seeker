import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndexBasicModule } from './index-basic/index-basic.module';
import { IndexDailyModule } from './index-daily/index-daily.module';
import { QhBuyDateModule } from './qh-buy-date/qh-buy-date.module';
import { StockBasicModule } from './stock-basic/stock-basic.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    IndexBasicModule,
    Logger,
    IndexDailyModule,
    QhBuyDateModule,
    StockBasicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
