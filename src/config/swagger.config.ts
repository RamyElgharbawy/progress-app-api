import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Progress App API')
  .setDescription('API documentation for Progress App')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter your JWT token',
      in: 'header',
    },
    'JWT-auth', // use this in @ApiBearerAuth('JWT-auth') in controllers
  )
  //   .addTag('Users')
  .build();
