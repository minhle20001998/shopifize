import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { EntityModule } from '@shopifize/custom-nestjs';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    EntityModule,
    ThrottlerModule.forRoot([
      {
        ttl: 30,
        limit: 2,
      },
    ]),
  ],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
