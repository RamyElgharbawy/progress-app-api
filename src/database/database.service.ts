import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CustomTypeORMLogger } from './typeorm.logger';
import { IDatabaseConfig } from 'src/config/database.config';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbConfig = this.configService.get<IDatabaseConfig>('database');

    if (!dbConfig) {
      throw new Error(
        'Database configuration not found. Make sure database.config.ts is registered in ConfigModule',
      );
    }

    return {
      type: dbConfig?.type,
      host: dbConfig?.host,
      port: dbConfig?.port,
      username: dbConfig?.username,
      password: dbConfig?.password,
      database: dbConfig?.database,
      synchronize: false,
      logger: new CustomTypeORMLogger(),
      autoLoadEntities: true,
      migrationsRun: dbConfig?.isProduction,
      extra: {
        max: dbConfig.maxConnections,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
      },

      ssl: dbConfig.ssl,

      retryAttempts: 3,
      retryDelay: 3000,
    };
  }
}
