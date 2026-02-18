import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import { WinstonLoggerService } from '../logger/winston-logger.service';

interface ErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
  path: string;
}

/**
 * Global Exception Filter
 * Responsible for:
 * 1. Formatting ALL error responses consistently
 * 2. Logging errors via WinstonLoggerService
 *
 * Note: HttpLoggingInterceptor also logs errors, but only with basic info.
 * This filter logs with full context (DB errors, stack traces, etc.)
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const errorResponse = this.buildErrorResponse(exception, request);

    this.logError(exception, errorResponse, request);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  // ─── Build Error Response ────────────────────────────────────────────────────

  private buildErrorResponse(
    exception: unknown,
    request: Request,
  ): ErrorResponse {
    const timestamp = new Date().toISOString();
    const path = request.url;

    // 1. NestJS HTTP exceptions (NotFoundException, BadRequestException, etc.)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message: string | string[];
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        message = (exceptionResponse as { message: string | string[] }).message;
      } else {
        message = exception.message;
      }

      return {
        success: false,
        statusCode: status,
        error: exception.name.replace('Exception', ''),
        message,
        timestamp,
        path,
      };
    }

    // 2. TypeORM query errors (unique constraint, foreign key, etc.)
    if (exception instanceof QueryFailedError) {
      const dbError = this.handleDatabaseError(
        exception as QueryFailedError & {
          code?: string;
          detail?: string;
          column?: string;
        },
      );
      return { success: false, ...dbError, timestamp, path };
    }

    // 3. TypeORM entity not found
    if (exception instanceof EntityNotFoundError) {
      return {
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: 'The requested resource was not found',
        timestamp,
        path,
      };
    }

    // 4. Any other unexpected error → never expose internals
    return {
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      timestamp,
      path,
    };
  }

  // ─── Handle Database Errors ──────────────────────────────────────────────────

  private handleDatabaseError(
    exception: QueryFailedError & {
      code?: string;
      detail?: string;
      column?: string;
    },
  ): {
    statusCode: number;
    error: string;
    message: string;
  } {
    const code = exception.code ?? 'UNKNOWN';
    const detail = exception.detail ?? '';
    const column = exception.column ?? 'unknown';

    switch (code) {
      case '23505': // Unique constraint violation
        return {
          statusCode: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: this.extractDuplicateKeyMessage(detail),
        };
      case '23503': // Foreign key constraint
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: 'Related resource not found or constraint violation',
        };
      case '23502': // Not null constraint
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: `Field '${column}' cannot be null`,
        };
      case '22P02': // Invalid input syntax
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: 'Invalid input format',
        };
      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Database Error',
          message: 'A database error occurred',
        };
    }
  }

  private extractDuplicateKeyMessage(detail: string): string {
    if (!detail) return 'A record with this value already exists';
    const match = detail.match(/Key \((.+?)\)=/);
    return match
      ? `${match[1]} already exists`
      : 'A record with this value already exists';
  }

  // ─── Logging ─────────────────────────────────────────────────────────────────

  private logError(
    exception: unknown,
    errorResponse: ErrorResponse,
    request: Request,
  ): void {
    const { statusCode, message, path } = errorResponse;

    const meta = {
      type: 'EXCEPTION',
      method: request.method,
      url: path,
      statusCode,
      message,
      ip: request.ip,
      userAgent: request.headers['user-agent'] || '',
      timestamp: new Date().toISOString(),
    };

    if (statusCode >= 500) {
      // Server errors: log full stack trace
      this.logger.logWithMeta('error', 'Unhandled Exception', {
        ...meta,
        stack: exception instanceof Error ? exception.stack : String(exception),
        exception: exception instanceof Error ? exception.message : exception,
      });
    } else if (statusCode >= 400) {
      // Client errors: brief warning, no stack trace needed
      this.logger.logWithMeta('warn', 'Client Exception', meta);
    }
  }
}
