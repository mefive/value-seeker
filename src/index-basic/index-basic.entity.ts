import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../base/base.entity';

@Entity('index_basic')
export class IndexBasicEntity extends BaseEntity {
  @Index()
  @Column()
  tsCode: string = '';

  @Index()
  @Column({ nullable: true })
  market?: string;

  @Column()
  name: string = '';

  @Column({
    nullable: true,
  })
  fullname?: string;

  @Column('date', { nullable: true })
  listDate?: Date;

  @Column('date', {
    nullable: true,
  })
  expDate?: Date;

  @Column('date', {
    nullable: true,
  })
  startDate?: Date;

  @Column('date', {
    nullable: true,
  })
  endDate?: Date;
}
