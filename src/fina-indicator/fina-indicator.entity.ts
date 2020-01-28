import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../base/base.entity';

@Entity('fina_indicator')
export class FinaIndicatorEntity extends BaseEntity {
  @Index()
  @Column()
  tsCode: string = '';

  @Index()
  @Column('date')
  endDate: Date = new Date();

  // 基本每股收益
  @Column('double', { precision: 10, scale: 2, nullable: true })
  eps?: number;

  // 资产负债
  @Column('double', { precision: 20, scale: 2, nullable: true })
  debtToAssets?: number;

  @Index()
  @Column('double', { precision: 10, scale: 2, nullable: true })
  roe?: number;

  @Column('double', { precision: 10, scale: 2, nullable: true })
  roa?: number;

  // 归属母公司股东的净利润同比增长率
  @Column('double', { precision: 10, scale: 2, nullable: true })
  netprofitYoy?: number;

  // 归属母公司股东的净利润-扣除非经常损益同比增长率
  @Column('double', { precision: 10, scale: 2, nullable: true })
  dtNetprofitYoy?: number;
}
