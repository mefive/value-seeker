import { PrimaryGeneratedColumn } from 'typeorm';

abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}

export default BaseEntity;
