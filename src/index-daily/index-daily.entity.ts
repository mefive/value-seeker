import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.entity';

@Entity('index_daily')
export class IndexDailyEntity extends BaseEntity {
  @Column()
  tsCode: string = '';

  @Column()
  tradeDate: string = '';

  @Column()
  close: number = 0;

  @Column()
  open: number = 0;

  @Column()
  high: number = 0;

  @Column()
  low: number = 0;

  @Column()
  change: number = 0;

  @Column()
  pctChg: number = 0;

  @Column()
  vol: number = 0;

  @Column()
  amount: number = 0;
}
