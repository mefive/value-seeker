import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.entity';

@Entity('qh_buy_date')
export class QhBuyDateEntity extends BaseEntity {
  @Column()
  tsCode: string = '';

  @Column()
  period: number = 0;

  @Column('date')
  targetDate: Date = new Date();

  @Column('date')
  alertDate: Date = new Date();
}
