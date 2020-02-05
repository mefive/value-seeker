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
import { DailyBasicService } from './daily-basic.service';

@Controller('daily-basic')
export class DailyBasicController {
  constructor(private readonly dailyBasicService: DailyBasicService) {}

  @Get()
  async findAll(@Query() query: { tsCode: string }) {
    if (!query.tsCode) {
      throw new BadRequestException();
    }
    return await this.dailyBasicService.findAll(query);
  }

  @Post('load')
  async load(@Body() body: { tsCode?: string; assetType?: AssetType }) {
    const { tsCode, assetType } = body;

    if (!tsCode || !assetType) {
      throw new BaseAudioContext();
    }

    await this.dailyBasicService.loadData(tsCode, assetType);

    return `更新 ${tsCode} 日基本指标数据成功`;
  }
}
