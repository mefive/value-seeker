import { getConnection, ObjectType } from 'typeorm';

export function batchInsert<T>(Entity: ObjectType<T>, data: T[]) {
  return getConnection()
    .createQueryBuilder()
    .insert()
    .into(Entity)
    .values(data)
    .execute();
}
