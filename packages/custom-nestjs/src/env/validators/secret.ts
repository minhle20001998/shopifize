import { IsString } from 'class-validator';

export class SecretEnv {
  @IsString()
  jwt_secret: string;

  @IsString()
  refresh_jwt_secret: string;
}
