import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { TypeormExceptionFilter } from '../typeorm-exception.filter';
import { PagingRequest } from '../types';
import { IndexBasicService } from './index-basic.service';

@Controller('index-basic')
export class IndexBasicController {
  constructor(private readonly indexBasicService: IndexBasicService) {}

  @Get()
  async findAll(
    @Query()
    query: Partial<PagingRequest> & { market?: string; tsCode?: string },
  ) {
    return await this.indexBasicService.findAll(query);
  }

  @Post('load')
  async loadData(@Body() body: { market?: string }) {
    const { market = 'SSE' } = body;
    await this.indexBasicService.loadData(market);
    return `下载指数${market}成功`;
  }

  @Get(':id')
  @UseFilters(new TypeormExceptionFilter())
  async findOne(@Param() params: { id: string }) {
    return await this.indexBasicService.findOne(params.id);
  }
}
