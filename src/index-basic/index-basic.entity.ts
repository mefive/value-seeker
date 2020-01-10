import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { IndexBasicInterface } from './index-basic.interface';

@Entity('index_basic')
export class IndexBasicEntity extends BaseEntity
  implements IndexBasicInterface {
  @Column()
  tsCode: string;

  @Column()
  name: string;

  @Column()
  fullname: string;
}
