import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { IndexBasicInterface } from './index-basic.interface';

@Entity('index_basic')
export class IndexBasicEntity extends BaseEntity<IndexBasicInterface>
  implements IndexBasicInterface {
  @Column()
  tsCode: string;

  @Column({
    charset: 'utf8',
  })
  name: string;

  @Column({
    charset: 'utf8',
    nullable: true,
  })
  fullname: string;
}
