import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { batchInsert } from '../utils/query';
import { tushare } from '../utils/tushare';
import { IndexBasicEntity } from './index-basic.entity';

@Injectable()
export class IndexBasicService extends BaseService {
  async loadData() {
    const resp = await tushare<IndexBasicEntity[]>('index_basic', {
      market: 'SSE',
    });

    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(IndexBasicEntity)
      .execute();

    await batchInsert(IndexBasicEntity, resp.data);
  }
}
