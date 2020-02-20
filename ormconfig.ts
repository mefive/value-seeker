import { SnakeNamingStrategy } from './src/utils/namingStrategies';

module.exports = {
  type: 'mysql',
  // host: 'localhost',
  host: '111.229.196.34',
  port: 3306,
  username: 'mefive',
  password: 'password',
  database: 'db',
  synchronize: false,
  charset: 'utf8mb4',
  namingStrategy: new SnakeNamingStrategy(),
  logging: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
