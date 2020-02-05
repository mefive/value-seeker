import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { AssetType } from '../enums';
import { PagingRequest } from '../types';
import { DailyService } from './daily.service';

@Controller('daily')
export class DailyController {
  constructor(private readonly dailyService: DailyService) {}

  @Get()
  async findAll(@Query() query: { tsCode: string }) {
    if (!query.tsCode) {
      throw new BadRequestException();
    }
    return await this.dailyService.findAll(query);
  }

  @Post('load')
  async load(@Body() body: { tsCode?: string; assetType: AssetType }) {
    const { tsCode, assetType } = body;

    if (!tsCode || !assetType) {
      throw new BadRequestException();
    }

    await this.dailyService.loadData(tsCode, assetType);

    return `更新日交易数据 ${tsCode} 成功`;
  }
}
