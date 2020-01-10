import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { IndexBasicEntity } from './index-basic.entity';

@Injectable()
export class IndexBasicService extends BaseService<IndexBasicEntity> {}
