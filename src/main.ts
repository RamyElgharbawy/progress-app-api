import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './config/app.config';
import { WinstonLoggerService } from './common/logger/winston-logger.service';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Buffer logs until Winston is ready
  });

  // Get config service
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  // Use Winston logger
  const logger = app.get(WinstonLoggerService);
  app.useLogger(logger);

  // 1. Security middleware
  // TODO: app.use(helmet());
  // TODO: app.use(cookieParser());

  // 2. Compression
  // TODO: app.use(compression());

  // 3. Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert types automatically
      },
    }),
  );

  // TODO: Global response interceptor
  // app.useGlobalInterceptors(new ResponseInterceptor());

  // TODO: Global JWT authentication guard
  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new JwtAuthGuard(reflector));

  // Global Prefix for Api Version
  app.setGlobalPrefix(`${appConfig?.apiPrefix}/${appConfig?.apiVersion}`);

  // Enable CORS
  app.enableCors({
    origin: appConfig?.corsOrigin, //TODO: Configure this based on your frontend URL in production
    credentials: true,
  });

  // 6. Enable shutdown hooks(graceful shutdown)
  app.enableShutdownHooks();

  // Swagger setup
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Start server
  const port = appConfig?.port || 3000;
  await app.listen(port);

  logger.log(`🚀 Progress-App API is running on: ${await app.getUrl()}`);
  logger.log(`📝 API Documentation: ${await app.getUrl()}/api`);
  logger.log(`🌐 Environment: ${configService.get('NODE_ENV')}`);
}
void bootstrap();
