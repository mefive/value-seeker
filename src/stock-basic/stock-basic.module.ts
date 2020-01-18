import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockBasicEntity } from './stock-basic.entity';
import { StockBasicService } from './stock-basic.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockBasicEntity])],
  providers: [StockBasicService],
})
export class StockBasicModule {}
