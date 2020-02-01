import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { PagingRequest } from '../types';
import { DailyBasicService } from './daily-basic.service';

@Controller('daily-basic')
export class DailyBasicController {
  constructor(private readonly dailyBasicService: DailyBasicService) {}

  @Get()
  async findAll(@Query() query: Partial<PagingRequest> & { tsCode: string }) {
    if (!query.tsCode) {
      throw new BadRequestException();
    }
    return await this.dailyBasicService.findAll(query);
  }
}
