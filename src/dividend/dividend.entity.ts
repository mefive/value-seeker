import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../base/base.entity';

@Entity('dividend')
export class DividendEntity extends BaseEntity {
  @Index()
  @Column()
  tsCode: string = '';

  // 实施日期
  @Column('date', { nullable: true })
  exDate?: Date ;

  // 分红年度
  @Column('date')
  endDate: Date = new Date();

  // 每股送股比例
  @Column('float', { precision: 5, scale: 2, nullable: true })
  stkBoRate?: number;

  // 每股转增比例
  @Column('float', { precision: 5, scale: 2, nullable: true })
  stkCoRate?: number;

  // 每股分红（税前）
  @Column('float', { precision: 5, scale: 2, nullable: true })
  cashDivTax?: number;
}
