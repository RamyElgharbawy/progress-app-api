import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { CustomLogger } from '../logger/custom-logger.service';

@Injectable()
export class WinstonLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    // Generate unique request ID
    const requestId = this.generateRequestId();
    request['requestId'] = requestId;

    // Log incoming request - FIXED: Use string message
    this.logger.log(`Incoming Request ${method} ${originalUrl}`, {
      requestId,
      type: 'REQUEST_IN',
      method,
      url: originalUrl,
      ip: ip || request.socket.remoteAddress,
      userAgent,
      timestamp: startTime,
      headers: this.sanitizeHeaders(request.headers),
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - startTime;
          const { statusCode } = response;

          // Log successful response - FIXED: Use string message
          this.logger.log(
            `Response ${method} ${originalUrl} ${statusCode} ${responseTime}ms`,
            {
              requestId,
              type: 'RESPONSE_OUT',
              method,
              url: originalUrl,
              statusCode,
              responseTime,
              ip: ip || request.socket.remoteAddress,
              timestamp: Date.now(),
              responseSize: this.getResponseSize(data),
            },
          );

          // Performance warnings
          if (responseTime > 500) {
            this.logger.warn(
              `Slow API Response ${method} ${originalUrl} ${responseTime}ms`,
              {
                requestId,
                responseTime,
                threshold: 500,
                url: originalUrl,
              },
            );
          }
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          const statusCode = error.getStatus ? error.getStatus() : 500;

          // Log error - FIXED: Use string message
          this.logger.error(
            `API Error ${method} ${originalUrl} ${statusCode} ${responseTime}ms`,
            error.stack,
            {
              requestId,
              type: 'ERROR_RESPONSE',
              method,
              url: originalUrl,
              statusCode,
              responseTime,
              error: {
                name: error.name,
                message: error.message,
              },
              ip: ip || request.socket.remoteAddress,
              timestamp: Date.now(),
            },
          );
        },
      }),
    );
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

    sensitiveHeaders.forEach((header) => {
      if (sanitized[header]) {
        sanitized[header] = '***REDACTED***';
      }
      if (sanitized[header.toLowerCase()]) {
        sanitized[header.toLowerCase()] = '***REDACTED***';
      }
    });

    return sanitized;
  }

  private getResponseSize(data: any): number {
    try {
      return Buffer.byteLength(JSON.stringify(data), 'utf8');
    } catch {
      return 0;
    }
  }
}
