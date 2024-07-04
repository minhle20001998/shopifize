import { IsString } from 'class-validator';

export class PostgresEnv {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  db: string;
}
