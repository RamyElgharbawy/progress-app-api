import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '../../config/winston.config';
import { CustomLogger } from './custom-logger.service';
import { WinstonLoggingInterceptor } from '../interceptors/winston-logging.interceptor';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

@Global()
@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  providers: [CustomLogger, WinstonLoggingInterceptor, LoggingInterceptor],
  exports: [CustomLogger, WinstonLoggingInterceptor, LoggingInterceptor],
})
export class LoggerModule {}
