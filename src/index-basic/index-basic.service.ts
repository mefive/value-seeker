import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { tushare } from '../utils/tushare';
import { IndexBasicEntity } from './index-basic.entity';
import { IndexBasicInterface } from './index-basic.interface';

@Injectable()
export class IndexBasicService extends BaseService {
  constructor(
    @InjectRepository(IndexBasicEntity)
    private readonly indexBasicRepository: Repository<IndexBasicEntity>,
  ) {
    super();
  }

  async loadData() {
    const resp = await tushare<IndexBasicInterface[]>('index_basic', {
      market: 'SSE',
    });

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(IndexBasicEntity)
      .values(resp.data)
      .execute();
  }
}
