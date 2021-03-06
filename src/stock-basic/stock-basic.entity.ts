import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { StockListStatus } from '../enums';

@Entity('stock_basic')
export class StockBasicEntity extends BaseEntity {
  @Column()
  tsCode: string = '';

  @Column()
  symbol: string = '';

  @Column()
  name: string = '';

  @Column({ nullable: true })
  industry?: string;

  @Column({ nullable: true })
  area?: string;

  @Column({ nullable: true })
  market?: string;

  @Column({ nullable: true })
  exchange?: string;

  @Column('date')
  listDate: Date = new Date();

  @Column('date', { nullable: true })
  startDate?: Date;

  @Column('date', { nullable: true })
  endDate?: Date;
}
