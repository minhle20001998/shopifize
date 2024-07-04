import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  PassportModule,
  EnvModule,
  EnvService,
  MailModule,
  EntityModule,
  CustomJwtModule,
  CookieToHeaderMiddleware,
} from '@shopifize/custom-nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Env } from './helpers';

@Module({
  imports: [
    EnvModule.register({
      env: process.env.NODE_ENV,
      class: Env,
    }),
    CustomJwtModule,
    PassportModule,
    EntityModule,
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [EnvModule],
        inject: [EnvService],
        useFactory: async (env: EnvService<Env>) => {
          const rmqUsername = env.get('rabbitmq.default_user');
          const rmqPassword = env.get('rabbitmq.default_pass');
          const rmqUrl = `amqp://${rmqUsername}:${rmqPassword}@localhost:5672`;
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rmqUrl],
              queue: 'user_queue',
              queueOptions: {
                durable: false,
              },
            },
          };
        },
      },
    ]),
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieToHeaderMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
