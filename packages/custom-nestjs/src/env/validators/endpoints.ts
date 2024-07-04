import { IsString } from 'class-validator';

export class EndpointsEnv {
  @IsString()
  client: string;

  @IsString()
  admin: string;

  @IsString()
  auth: string;

  @IsString()
  user: string;
}
