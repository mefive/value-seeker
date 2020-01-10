import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndexBasicModule } from './index-basic/index-basic.module';
import { BaseService } from './base/base.service';

@Module({
  imports: [TypeOrmModule.forRoot(), IndexBasicModule],
  controllers: [AppController],
  providers: [AppService, BaseService],
})
export class AppModule {}
