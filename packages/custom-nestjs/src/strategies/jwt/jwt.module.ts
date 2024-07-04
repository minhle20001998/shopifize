import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/database';
import { EntityModule } from 'src/entities';
import { JwtStrategy } from './jwt.strategy';
import { EnvModule, EnvService, GlobalEnv } from 'src/env';

export const RegisteredJwtModule = JwtModule.registerAsync({
  useFactory: (env: EnvService<GlobalEnv>) => {
    return {
      global: true,
      secret: env.get('secret.jwt_secret'),
      signOptions: { expiresIn: '1m' },
    };
  },
  inject: [EnvService],
  imports: [EnvModule],
});

@Global()
@Module({
  providers: [JwtStrategy],
  imports: [
    EnvModule.register({
      env: process.env.NODE_ENV,
      class: GlobalEnv,
    }),
    PassportModule,
    RegisteredJwtModule,
    DatabaseModule,
    EntityModule,
  ],
  exports: [RegisteredJwtModule, JwtStrategy],
})
export class CustomJwtModule {}
