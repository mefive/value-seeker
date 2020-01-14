import { Module } from '@nestjs/common';
import { IndexDailyService } from './index-daily.service';

@Module({
  providers: [IndexDailyService],
})
export class IndexDailyModule {}
