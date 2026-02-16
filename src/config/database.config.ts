import { registerAs } from '@nestjs/config';
import { CommonConfig } from './common.config';

export interface IDatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  isProduction: boolean;
  environment: string;
  maxConnections: number;
  ssl: boolean | object;
}

class DatabaseConfig extends CommonConfig {
  load(): IDatabaseConfig {
    return {
      type: 'postgres',
      host: this.getEnvString('DATABASE_HOST'),
      port: this.getEnvNumber('DATABASE_PORT'),
      username: this.getEnvString('DATABASE_USERNAME'),
      password: this.getEnvString('DATABASE_PASSWORD'),
      database: this.getEnvString('DATABASE_NAME', 'progress_app'),
      synchronize: false,
      logging: this.isDevelopment() && !this.isTest(),
      isProduction: this.isProduction(),
      environment: this.getEnvString('NODE_ENV', 'development'),
      maxConnections: this.getEnvNumber('DATABASE_MAX_CONNECTIONS', 10),
      ssl: this.isProduction()
        ? {
            rejectUnauthorized: false,
          }
        : false,
    };
  }
}

export default registerAs('database', () => new DatabaseConfig().load());
