import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { UnauthorizedExceptionFilter } from '@shopifize/custom-nestjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.CLIENT_URL], // TODO: remove this later
    credentials: true,
  });
  app.setGlobalPrefix('v1');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        console.log({ errors });
        const errorMessages = {};
        errors.forEach((error) => {
          errorMessages[error.property] = Object.values(error.constraints)
            .join('. ')
            .trim();
        });
        return new BadRequestException(errorMessages);
      },
    }),
  );
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.startAllMicroservices();
  await app.listen(process.env.GATEWAY_PORT, () => {
    console.log('Gateway listen on port', process.env.GATEWAY_PORT);
  });
}
bootstrap();
