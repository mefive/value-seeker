import { Column, Entity } from 'typeorm';
import BaseEntity from '../base/BaseEntity';

@Entity()
export class IndexBasic extends BaseEntity {
  @Column()
  tsCode: string;

  @Column()
  name: string;

  @Column()
  fullname: string;
}
