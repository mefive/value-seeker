import { SnakeNamingStrategy } from './src/utils/namingStrategies';

module.exports = {
  type: 'mysql',
  host: 'localhost',
  port: 3308,
  username: 'mefive',
  password: 'password',
  database: 'db',
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
  logging: false,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
