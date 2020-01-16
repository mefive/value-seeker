import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.entity';

@Entity('index_basic')
export class IndexBasicEntity extends BaseEntity {
  @Column()
  tsCode: string = '';

  @Column({
    charset: 'utf8',
  })
  name: string = '';

  @Column({
    charset: 'utf8',
    nullable: true,
  })
  fullname?: string;

  @Column('date', { nullable: true })
  listDate?: Date;

  @Column('date', {
    nullable: true,
  })
  expDate?: Date;
}
