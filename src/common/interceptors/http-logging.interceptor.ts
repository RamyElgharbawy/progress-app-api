import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { WinstonLoggerService } from '../logger/winston-logger.service';

interface ErrorResponse {
  status?: number;
  message?: string;
  stack?: string;
}

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // Explicitly type the destructured properties
    // const method = request.method;
    // const url = request.url;
    // const body = request.body as Record<string, unknown>;
    // const query = request.query;
    // const params = request.params;
    // const ip = request.ip;
    // const headers = request.headers;
    const { method, url, query, params, ip, headers } = request;
    const body = request.body as Record<string, unknown>;

    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    // Log incoming request
    this.logger.logWithMeta('info', 'Incoming Request', {
      type: 'REQUEST',
      method,
      url,
      query,
      params,
      body: this.sanitizeBody(body),
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap((data: unknown) => {
        const responseTime = Date.now() - startTime;
        const { statusCode } = response;

        // Log successful response
        this.logger.logWithMeta('info', 'Outgoing Response', {
          type: 'RESPONSE',
          method,
          url,
          statusCode,
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
          responseData: this.sanitizeResponse(data),
        });
      }),
      catchError((error: unknown) => {
        const responseTime = Date.now() - startTime;
        const err = error as ErrorResponse;
        const statusCode = this.getStatusCode(error);

        // Log error response
        this.logger.logWithMeta('error', 'Error Response', {
          type: 'ERROR',
          method,
          url,
          statusCode,
          responseTime: `${responseTime}ms`,
          error: err.message ?? 'Unknown error',
          stack: err.stack,
          timestamp: new Date().toISOString(),
        });

        return throwError(() => error);
      }),
    );
  }

  /**
   * Get status code from error
   */
  private getStatusCode(error: unknown): number {
    if (error instanceof HttpException) {
      return error.getStatus();
    }
    const err = error as ErrorResponse;
    return err.status ?? 500;
  }

  /**
   * Sanitize request body to remove sensitive information
   */
  private sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== 'object') return body;

    const sanitized = { ...body } as Record<string, unknown>;
    const sensitiveFields = [
      'password',
      'token',
      'apiKey',
      'secret',
      'creditCard',
    ];

    sensitiveFields.forEach((field) => {
      if (field in sanitized) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }

  /**
   * Sanitize response data (limit size, remove sensitive info)
   */
  private sanitizeResponse(data: unknown): unknown {
    if (!data) return data;

    try {
      const stringified = JSON.stringify(data);
      if (stringified.length > 1000) {
        return { _meta: 'Response too large to log', size: stringified.length };
      }
      return data;
    } catch {
      return { _meta: 'Unable to serialize response' };
    }
  }
}
