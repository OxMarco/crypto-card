import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true, cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unknown properties
      transform: true, // auto-transform request payloads to specified types
    }),
  );
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Website Backend Docs')
    .setDescription('Inspip website backend documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
