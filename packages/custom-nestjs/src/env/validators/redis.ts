import { IsString } from 'class-validator';

export class RedisEnv {
  @IsString()
  product: string;
}
