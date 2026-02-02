import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, originalUrl, ip, body, query, params } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    // Log request
    this.logger.log({
      message: 'Request',
      type: 'REQUEST',
      method,
      url: originalUrl,
      ip,
      userAgent,
      body: this.sanitizeBody(body),
      query,
      params,
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - startTime;
          const { statusCode } = response;

          // Log successful response
          this.logger.log({
            message: 'Response',
            type: 'RESPONSE',
            method,
            url: originalUrl,
            statusCode,
            responseTime: `${responseTime}ms`,
            ip,
            timestamp: new Date().toISOString(),
          });

          // Log slow requests
          if (responseTime > 1000) {
            this.logger.warn({
              message: 'Slow Request',
              type: 'SLOW_REQUEST',
              method,
              url: originalUrl,
              responseTime: `${responseTime}ms`,
              threshold: '1000ms',
              timestamp: new Date().toISOString(),
            });
          }
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          const statusCode = error.getStatus ? error.getStatus() : 500;

          // Log error response
          this.logger.error({
            message: 'Error Response',
            type: 'ERROR_RESPONSE',
            method,
            url: originalUrl,
            statusCode,
            responseTime: `${responseTime}ms`,
            error: {
              message: error.message,
              name: error.name,
              stack:
                process.env.NODE_ENV === 'development'
                  ? error.stack
                  : undefined,
            },
            ip,
            timestamp: new Date().toISOString(),
          });
        },
      }),
    );
  }

  // Sanitize sensitive data from logs
  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'creditCard',
      'ssn',
      'authorization',
      'apiKey',
    ];

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }
}
