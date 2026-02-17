import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Progress App API')
  .setDescription('API documentation for Progress App')
  .setVersion('1.0')
  //   .addTag('Users')
  .build();
