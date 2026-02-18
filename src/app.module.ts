import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { getEnvName } from './config/utils/get-env-name';
import { validate } from './config/utils/validate-config';
import { CommonEnvValidation } from './config/validation/common.env.validation';
import { LoggerModule } from './common/logger/logger.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/database.config';
import { UsersModule } from './modules/user/users.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: getEnvName(),
      validate: validate(CommonEnvValidation),
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 1. Exception Filter — runs first on errors, formats + logs them
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },

    // 2. Http Logging Interceptor — logs every request/response/error
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },

    // 3. Response Interceptor — wraps successful responses in { success, data, meta }
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
