import { Controller, Get, Query } from '@nestjs/common';
import { PagingRequest } from '../types';
import { StockBasicService } from './stock-basic.service';

@Controller('stock-basic')
export class StockBasicController {
  constructor(private readonly stockBasicService: StockBasicService) {}

  @Get()
  async findAll(@Query() query: Partial<PagingRequest> & { tsCode?: string }) {
    return await this.stockBasicService.findAll(query);
  }
}
