import { Module } from '@nestjs/common';
import { DailyService } from './daily.service';

@Module({
  providers: [DailyService],
})
export class DailyModule {}
