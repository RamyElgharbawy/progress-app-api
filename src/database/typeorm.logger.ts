import { Logger } from '@nestjs/common';
import { Logger as TypeORMLogger } from 'typeorm';

/**
 * Custom TypeORM logger that integrates with NestJS Logger
 * Provides better formatting and control over database logging
 */
export class CustomTypeORMLogger implements TypeORMLogger {
  private readonly logger = new Logger('TypeORM');
  private readonly isDevelopment = process.env.NODE_ENV !== 'production';

  log(level: 'log' | 'info' | 'warn', message: any): void {
    if (this.isDevelopment) {
      switch (level) {
        case 'log':
        case 'info':
          this.logger.log(message);
          break;
        case 'warn':
          this.logger.warn(message);
          break;
      }
    }
  }

  logMigration(message: string): void {
    this.logger.log(`Migration: ${message}`);
  }

  logQuery(query: string, parameters?: any[]): void {
    if (this.isDevelopment) {
      const formattedParams = parameters?.length
        ? ` -- Parameters: ${JSON.stringify(parameters)}`
        : '';
      this.logger.debug(`Query: ${query}${formattedParams}`);
    }
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
  ): void {
    const errorMessage = error instanceof Error ? error.message : error;
    const formattedParams = parameters?.length
      ? ` -- Parameters: ${JSON.stringify(parameters)}`
      : '';
    this.logger.error(
      `Query failed: ${query}${formattedParams}\nError: ${errorMessage}`,
    );
  }

  logQuerySlow(time: number, query: string, parameters?: any[]): void {
    const formattedParams = parameters?.length
      ? ` -- Parameters: ${JSON.stringify(parameters)}`
      : '';
    this.logger.warn(
      `Slow query detected (${time}ms): ${query}${formattedParams}`,
    );
  }

  logSchemaBuild(message: string): void {
    if (this.isDevelopment) {
      this.logger.log(`Schema: ${message}`);
    }
  }
}
