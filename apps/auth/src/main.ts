import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { AllExceptionsFilter, EnvService } from '@shopifize/custom-nestjs';
import { Env } from './helpers';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env: EnvService<Env> = app.get(EnvService);
  const port = env.get('port');
  const rmqUsername = env.get('rabbitmq.default_user');
  const rmqPassword = env.get('rabbitmq.default_pass');
  const rmqUrl = `amqp://${rmqUsername}:${rmqPassword}@localhost:5672`;
  app.use(cookieParser());
  app.setGlobalPrefix('v1');
  app.enableCors({
    origin: [env.get('endpoints.client'), env.get('endpoints.admin')], // TODO: remove this later
    credentials: true,
  });
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: 'auth_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.startAllMicroservices();
  await app.listen(port, () => {
    console.log('Auth service starts on port', port);
  });
}
bootstrap();
