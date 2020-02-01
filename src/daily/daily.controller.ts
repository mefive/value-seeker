import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { PagingRequest } from '../types';
import { DailyService } from './daily.service';

@Controller('daily')
export class DailyController {
  constructor(private readonly dailyService: DailyService) {}

  @Get()
  async findAll(@Query() query: Partial<PagingRequest> & { tsCode: string }) {
    if (!query.tsCode) {
      throw new BadRequestException();
    }
    return await this.dailyService.findAll(query);
  }
}
