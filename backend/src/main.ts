import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app/app.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("deCAFF")
    .setDescription("The secure special image marketplace")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/swagger", app, document);

  const port = process.env.backend_default_port ?? 3010;

  await app.listen(port);

  Logger.log("8====================================D");
  Logger.log(`Application is running on: http://localhost:${port}`);
  Logger.log(`Swagger is available on: http://localhost:${port}/api/swagger`);
}

bootstrap();
