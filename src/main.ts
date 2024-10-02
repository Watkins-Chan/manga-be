/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Auto transform data type
      forbidNonWhitelisted: true, // Throw error if has fields not define
      whitelist: true, // Remove fields not define in DTO
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Manga API')
    .setDescription('API for management Manga and Chapters')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  app.enableCors();
  await app.listen(3001);
}
bootstrap();
