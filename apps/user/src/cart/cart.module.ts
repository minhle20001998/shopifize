import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
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
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
