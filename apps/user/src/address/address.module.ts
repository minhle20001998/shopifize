import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
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
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
