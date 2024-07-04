import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import {
  CustomJwtModule,
  EntityModule,
  EnvModule,
} from '@shopifize/custom-nestjs';
import { Env } from 'src/helpers';

@Module({
  imports: [
    EnvModule.register({
      env: process.env.NODE_ENV,
      class: Env,
    }),
    EntityModule,
    CustomJwtModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
