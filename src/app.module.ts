import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { getEnvName } from './config/utils/get-env-name';
import { validate } from './config/utils/validate-config';
import { CommonEnvValidation } from './config/validation/common.env.validation';
import { LoggerModule } from './common/logger/logger.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/database.config';
import { UsersModule } from './modules/user/users.module';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
  ],
})
export class AppModule {}
