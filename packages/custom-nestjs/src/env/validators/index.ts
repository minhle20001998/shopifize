import { IsEnum, ValidateNested } from 'class-validator';
import { SecretEnv } from './secret';
import { Type } from 'class-transformer';
import { RabbitMQEnv } from './rabbitmq';
import { EndpointsEnv } from './endpoints';
import { PostgresEnv } from './postgres';
import { MailEnv } from './mail';
import { RedisEnv } from './redis';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class GlobalEnv {
  @IsEnum(NodeEnv)
  node_env: NodeEnv;

  @ValidateNested()
  @Type(() => SecretEnv)
  secret: SecretEnv;

  @ValidateNested()
  @Type(() => RabbitMQEnv)
  rabbitmq: RabbitMQEnv;

  @ValidateNested()
  @Type(() => EndpointsEnv)
  endpoints: EndpointsEnv;

  @ValidateNested()
  @Type(() => PostgresEnv)
  postgres: PostgresEnv;

  @ValidateNested()
  @Type(() => MailEnv)
  mail: MailEnv;

  @ValidateNested()
  @Type(() => RedisEnv)
  redis: RedisEnv;
}
