import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter, EnvService } from '@shopifize/custom-nestjs';
import { Env } from './helpers/types';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env: EnvService<Env> = app.get(EnvService);
  const port = env.get('port');
  app.setGlobalPrefix('v1');
  app.use(cookieParser());
  app.enableCors({
    origin: [env.get('endpoints.client'), env.get('endpoints.admin')], // TODO: remove this later
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(port, () => {
    console.log('Product service starts on port', port);
  });
}
bootstrap();