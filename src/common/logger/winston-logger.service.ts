import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

interface LogData {
  timestamp: string | number;
  level: string;
  message: string;
  context?: string;
  trace?: string;
  [key: string]: unknown;
}

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const transports: winston.transport[] = [
      // Console transport
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf((info: winston.Logform.TransformableInfo) => {
            const logData = info as unknown as LogData;
            const ctx =
              typeof logData.context === 'string'
                ? logData.context
                : 'Application';
            const ts = String(logData.timestamp);
            const lvl = String(logData.level);
            const msg = String(logData.message);
            const traceStr =
              typeof logData.trace === 'string' ? logData.trace : '';

            // Extract metadata (everything except known fields)
            const knownFields = [
              'timestamp',
              'level',
              'message',
              'context',
              'trace',
            ];
            const meta = Object.keys(logData)
              .filter((key) => !knownFields.includes(key))
              .reduce(
                (acc, key) => {
                  acc[key] = logData[key];
                  return acc;
                },
                {} as Record<string, unknown>,
              );

            const metaStr = Object.keys(meta).length
              ? JSON.stringify(meta)
              : '';

            return `${ts} [${ctx}] ${lvl}: ${msg} ${metaStr} ${traceStr}`.trim();
          }),
        ),
      }),
    ];

    // Add DailyRotateFile transports
    transports.push(
      new winston.transports.DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }) as winston.transport,
    );

    transports.push(
      new winston.transports.DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }) as winston.transport,
    );

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      defaultMeta: { service: process.env.APP_NAME || 'nestjs-app' },
      transports,
    });
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, { context, trace });
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context });
  }

  // Custom method for structured logging
  logWithMeta(
    level: string,
    message: string,
    meta: Record<string, unknown>,
  ): void {
    this.logger.log(level, message, meta);
  }
}
