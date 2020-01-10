import { Module } from '@nestjs/common';
import { IndexBasicService } from './index-basic.service';

@Module({
  providers: [IndexBasicService],
})
export class IndexBasicModule {}
