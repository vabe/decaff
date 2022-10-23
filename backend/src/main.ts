import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('deCaff')
    .setDescription('The secure special image marketplace')
    .setVersion('1.0')
    .addTag('caff')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  const port = 3000;

  await app.listen(port);

  Logger.log(`8====================================D`);
  Logger.log(`Application is running on: http://localhost:${port}`);
  Logger.log(`Swagger is available on: http://localhost:${port}/api/swagger`);
}

bootstrap();
