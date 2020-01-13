import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndexBasicModule } from './index-basic/index-basic.module';
import { IndexDailyModule } from './index-daily/index-daily.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    IndexBasicModule,
    Logger,
    IndexDailyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
