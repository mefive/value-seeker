import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { StockListStatus } from '../enums';

@Entity('stock_basic')
export class StockBasicEntity extends BaseEntity {
  @Column()
  tsCode: string = '';

  @Column()
  symbol: string = '';

  @Column({
    charset: 'utf8',
  })
  name: string = '';

  @Column({
    charset: 'utf8',
    nullable: true,
  })
  industry: string = '';

  @Column({
    nullable: true,
  })
  exchange?: string;

  @Column({
    nullable: true,
  })
  listStatus?: StockListStatus;

  @Column('date')
  listDate: Date = new Date();

  @Column('date', {
    nullable: true,
  })
  delistDate?: Date;

  @Column('date', {
    nullable: true,
  })
  startDate?: Date;
}
