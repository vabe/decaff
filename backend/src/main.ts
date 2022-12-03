import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app/app.module";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("deCAFF")
    .setDescription("The secure special image marketplace")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/swagger", app, document);

  const port = process.env.BACKEND_DEFAULT_PORT ?? 3010;

  await app.listen(port);

  Logger.log(`
#  ------------------------------------------------------------
#  ------------------------------------------------------------
#  ------$$\\------------$$$$$$\\---$$$$$$\\--$$$$$$$$\\-$$$$$$$$\\-
#  ------$$-|----------$$--__$$\\-$$--__$$\\-$$--_____|$$--_____|
#  -$$$$$$$-|-$$$$$$\\--$$-/--\\__|$$-/--$$-|$$-|------$$-|------
#  $$--__$$-|$$--__$$\\-$$-|------$$$$$$$$-|$$$$$\\----$$$$$\\----
#  $$-/--$$-|$$$$$$$$-|$$-|------$$--__$$-|$$--__|---$$--__|---
#  $$-|--$$-|$$---____|$$-|--$$\\-$$-|--$$-|$$-|------$$-|------
#  \\$$$$$$$-|\\$$$$$$$\\-\\$$$$$$--|$$-|--$$-|$$-|------$$-|------
#  -\\_______|-\\_______|-\\______/-\\__|--\\__|\\__|------\\__|------
#  ------------------------------------------------------------
#  ------------------------------------------------------------
  `);

  Logger.log("8====================================D");
  Logger.log(`Application is running on: http://localhost:${port}`);
  Logger.log(`Swagger is available on: http://localhost:${port}/api/swagger`);
}

bootstrap();
