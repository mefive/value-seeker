import { Module } from '@nestjs/common';
import { StockBasicService } from './stock-basic.service';

@Module({
  providers: [StockBasicService]
})
export class StockBasicModule {}
