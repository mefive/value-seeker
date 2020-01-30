import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexBasicEntity } from './index-basic.entity';
import { IndexBasicService } from './index-basic.service';
import { IndexBasicController } from './index-basic.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IndexBasicEntity])],
  providers: [IndexBasicService],
  controllers: [IndexBasicController],
})
export class IndexBasicModule {}
