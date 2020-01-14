import { SnakeNamingStrategy } from './src/utils/namingStrategies';

module.exports = {
  type: 'mysql',
  host: 'localhost',
  port: 3308,
  username: 'mefive',
  password: 'password',
  database: 'db',
  synchronize: false,
  charset: 'utf8',
  namingStrategy: new SnakeNamingStrategy(),
  logging: true,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
