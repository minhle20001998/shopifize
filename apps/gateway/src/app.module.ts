import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { UserModule } from './user/user.module';
import {
  CookieToHeaderMiddleware,
  CustomJwtModule,
  DatabaseModule,
  EntityModule,
} from '@shopifize/custom-nestjs';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ProductsModule,
    UserModule,
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '../../../.env'),
    }),
    CustomJwtModule,
    DatabaseModule,
    EntityModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieToHeaderMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
