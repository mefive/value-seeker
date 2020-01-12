import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexBasicEntity } from './index-basic.entity';
import { IndexBasicService } from './index-basic.service';

@Module({
  imports: [TypeOrmModule.forFeature([IndexBasicEntity])],
  providers: [IndexBasicService],
})
export class IndexBasicModule {}
