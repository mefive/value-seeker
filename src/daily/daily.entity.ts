import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../base/base.entity';

@Entity('daily')
export class DailyEntity extends BaseEntity {
  @Index()
  @Column()
  tsCode: string = '';

  @Column('date')
  tradeDate: Date = new Date();

  @Column('double', { precision: 20, scale: 2 })
  close: number = 0;

  @Column('double', { precision: 20, scale: 2 })
  open: number = 0;

  @Column('double', { precision: 20, scale: 2 })
  high: number = 0;

  @Column('double', { precision: 20, scale: 2 })
  low: number = 0;

  @Column('double', { precision: 20, scale: 2 })
  change: number = 0;

  @Column('double', { precision: 20, scale: 2 })
  pctChg: number = 0;

  @Column()
  vol: number = 0;

  @Column()
  amount: number = 0;

  @Column('double', { precision: 20, scale: 2, nullable: true })
  rsv?: number;

  @Column('double', { precision: 20, scale: 2, nullable: true })
  k: number = 50;

  @Column('double', { precision: 20, scale: 2, nullable: true })
  d: number = 50;

  @Column('double', { precision: 20, scale: 2, nullable: true })
  j: number = 0;
}
