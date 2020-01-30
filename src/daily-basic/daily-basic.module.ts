import { Module } from '@nestjs/common';
import { DailyBasicService } from './daily-basic.service';
import { DailyBasicController } from './daily-basic.controller';

@Module({
  providers: [DailyBasicService],
  controllers: [DailyBasicController]
})
export class DailyBasicModule {}
