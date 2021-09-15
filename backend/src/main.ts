import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());
  //app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes not expected attributes in post/update request body, help prevent malicious data from being sent into our Requests
      transform: true, // auto transforms payloads to DTO instances and performs primitive type conventions (path & query parameters come over the internet as string)
      forbidNonWhitelisted: true, // bad gatway error when not expected attributes in post/update request body
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const microserviceMQTT = app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.MQTT,
      options: {
        url: 'mqtt://localhost:1883',
        username: 'sarah',
        password: 'lalala',
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
