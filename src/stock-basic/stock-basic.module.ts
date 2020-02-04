import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockBasicEntity } from './stock-basic.entity';
import { StockBasicService } from './stock-basic.service';
import { StockBasicController } from './stock-basic.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StockBasicEntity])],
  providers: [StockBasicService],
  controllers: [StockBasicController],
})
export class StockBasicModule {}
