// src/common/logger/custom-logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { service: 'service-manager' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
      ],
    });
  }

  // FIXED: Accept metadata as second parameter
  log(message: string, metadata?: any) {
    this.logger.info(message, metadata);
  }

  // FIXED: Accept three parameters (message, trace, metadata)
  error(message: string, trace?: string, metadata?: any) {
    this.logger.error(message, { trace, ...metadata });
  }

  warn(message: string, metadata?: any) {
    this.logger.warn(message, metadata);
  }

  debug(message: string, metadata?: any) {
    this.logger.debug(message, metadata);
  }

  verbose(message: string, metadata?: any) {
    this.logger.verbose(message, metadata);
  }

  // Custom methods
  serviceAction(action: string, serviceName: string, details?: any) {
    this.logger.info(`Service Action: ${action}`, {
      context: 'ServiceManager',
      service: serviceName,
      details,
      timestamp: new Date().toISOString(),
    });
  }
}
