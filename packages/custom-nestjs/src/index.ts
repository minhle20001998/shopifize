import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../../.env') });

export * from './database';
export * from './decorators';
export * from './entities';
export * from './env';
export * from './filter';
export * from './guards';
export * from './middlewares';
export * from './strategies';
export * from '@nestjs/jwt';
export { PassportModule } from '@nestjs/passport';
export { decode, sign, verify } from 'jsonwebtoken';
export * from 'passport-jwt';
export * from './dtos';
export * from './mail';
export * from 'class-transformer';
export * from 'class-validator';
export * from './utilities';
