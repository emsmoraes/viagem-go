import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json } from 'express';
import { EnvService } from './modules/env/env.service';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const envService = app.get(EnvService);

  const port = envService.get('PORT');

  const config = new DocumentBuilder()
    .setTitle('ViagemGo api docs')
    .setDescription('Api para o projeto ViagemGo')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(
    json({
      verify: (req: any, res, buf) => {
        if (req.headers['stripe-signature']) {
          req.rawBody = buf;
        }
      },
    }),
  );

  await app.listen(port);
}
bootstrap();
