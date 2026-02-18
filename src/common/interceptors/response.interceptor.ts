import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

interface PaginatedData {
  data: unknown;
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
  path: string;
}

/**
 * Response Interceptor
 * ONLY responsible for formatting successful responses
 * Logging is already handled by HttpLoggingInterceptor
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        // Handle paginated responses { data, total, page, limit }
        if (this.isPaginatedResponse(data)) {
          const paginatedData = data;
          return {
            success: true as const,
            data: paginatedData.data as T,
            meta: {
              page: paginatedData.page,
              limit: paginatedData.limit,
              total: paginatedData.total,
              totalPages: Math.ceil(paginatedData.total / paginatedData.limit),
            },
            timestamp: new Date().toISOString(),
            path: request.url,
          };
        }

        // Standard response
        return {
          success: true as const,
          data: data as T,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }

  private isPaginatedResponse(data: unknown): data is PaginatedData {
    return (
      data !== null &&
      typeof data === 'object' &&
      'data' in data &&
      'total' in data &&
      'page' in data &&
      'limit' in data &&
      typeof (data as PaginatedData).total === 'number' &&
      typeof (data as PaginatedData).page === 'number' &&
      typeof (data as PaginatedData).limit === 'number'
    );
  }
}
