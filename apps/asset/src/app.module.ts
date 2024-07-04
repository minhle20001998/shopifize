import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntityModule, EnvModule } from '@shopifize/custom-nestjs';
import { Env } from './helpers/types';

@Module({
  imports: [
    EnvModule.register({
      env: process.env.NODE_ENV,
      class: Env,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
