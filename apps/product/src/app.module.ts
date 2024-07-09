import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  CookieToHeaderMiddleware,
  CustomJwtModule,
  EntityModule,
  EnvModule,
  EnvService,
} from '@shopifize/custom-nestjs';
import { Env } from './helpers/types';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { PublicModule } from './public/public.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    EnvModule.register({
      env: process.env.NODE_ENV,
      class: Env,
    }),
    RedisModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService<Env>) => {
        return {
          config: {
            url: env.get('redis.product'),
          },
        };
      },
    }),
    CustomJwtModule,
    EntityModule,
    CategoryModule,
    SubCategoryModule,
    PublicModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieToHeaderMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
