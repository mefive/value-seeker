import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../base/base.entity';

@Entity('trade_cal')
export class TradeCalEntity extends BaseEntity {
  @Index()
  @Column('date')
  calDate: Date = new Date();

  @Column('smallint', { nullable: true })
  total?: number;
}
