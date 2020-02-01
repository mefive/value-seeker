import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../base/base.entity';

@Entity('daily_basic')
export class DailyBasicEntity extends BaseEntity {
  @Index()
  @Column()
  tsCode: string = '';

  @Index()
  @Column('date')
  tradeDate: Date = new Date();

  // 总换手率
  @Column('double', { precision: 10, scale: 2, nullable: true })
  turnoverRate?: number;

  // 量比
  @Column('double', { precision: 10, scale: 2, nullable: true })
  volumeRatio?: number;

  @Column('double', { precision: 10, scale: 2, nullable: true })
  peTtm?: number;

  @Column('double', { precision: 10, scale: 2, nullable: true })
  pb?: number;

  @Column('double', { precision: 20, scale: 2, nullable: true })
  psTtm?: number;

  // 股息率TTM
  @Column('double', { precision: 20, scale: 2, nullable: true })
  dvTtm?: number;

  @Column('double', { precision: 10, scale: 2, nullable: true })
  totalShare?: number;

  @Column('double', { precision: 10, scale: 2, nullable: true })
  floatShare?: number;

  @Column('double', { precision: 20, scale: 2, nullable: true })
  totalMv?: number;
}
