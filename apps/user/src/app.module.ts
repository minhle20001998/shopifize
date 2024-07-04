import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import {
  CookieToHeaderMiddleware,
  CustomJwtModule,
  EntityModule,
  EnvModule,
} from '@shopifize/custom-nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Env } from './helpers';
import { AddressModule } from './address/address.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    EnvModule.register({
      env: process.env.NODE_ENV,
      class: Env,
    }),
    CustomJwtModule,
    EntityModule,
    AddressModule,
    CartModule,
    OrderModule,
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
