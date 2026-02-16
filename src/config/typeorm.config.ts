import { join } from 'node:path';
import { config } from 'dotenv';

// Load environment variables for CLI usage
const ENV = process.env.NODE_ENV;

config({
  path: !ENV ? '.env.development' : `.env.${ENV}`,
  debug: true,
});

import { DataSource, DataSourceOptions } from 'typeorm';
import databaseConfig from './database.config';

const dbConfig = databaseConfig();

console.log('This CLI operation was done on: ', {
  nodeEnv: dbConfig.environment,
  databasePort: dbConfig.port,
  databaseHost: dbConfig.host,
});

export default new DataSource({
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  synchronize: false,
  logging: dbConfig.logging,
  entities: [
    join(__dirname, '../modules/**/entities/*.entity{.ts,.js}'),
    join(__dirname, '../entities/*.entity{.ts,.js}'),
  ],
  migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
  migrationsTableName: 'app_migrations',
  migrationsRun: dbConfig.isProduction,
  factories: [],
} as DataSourceOptions);
