import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity<T> {
  @PrimaryGeneratedColumn()
  id: number;
}
