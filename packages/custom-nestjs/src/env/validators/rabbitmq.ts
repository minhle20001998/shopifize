import { IsString } from 'class-validator';

export class RabbitMQEnv {
  @IsString()
  erlang_cookie: string;

  @IsString()
  default_user: string;

  @IsString()
  default_pass: string;
}
