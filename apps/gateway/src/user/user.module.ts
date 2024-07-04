import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        useFactory: async () => {
          const rmqUsername = process.env.RABBITMQ_DEFAULT_USER;
          const rmqPassword = process.env.RABBITMQ_DEFAULT_PASS;
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
  ],
})
export class UserModule {}
