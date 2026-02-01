import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get config service
  const configService = app.get(ConfigService);

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
  const apiPrefix = configService.get('API_PREFIX', 'api');
  const apiVersion = configService.get('API_VERSION', 'v1');

  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

  // Enable CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'), //TODO: Configure this based on your frontend URL in production
    credentials: true,
  });

  // 6. Enable shutdown hooks(graceful shutdown)
  app.enableShutdownHooks();

  const port = configService.get('PORT', 3000);
  await app.listen(port);
  console.log(`🚀 Progress-App API is running on: ${await app.getUrl()}`);
  // console.log(`📝 API Documentation: ${await app.getUrl()}/api`);
  console.log(`🌐 Environment: ${configService.get('NODE_ENV')}`);
}
bootstrap();
