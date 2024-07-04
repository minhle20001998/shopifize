import { IsString } from 'class-validator';

export class MailEnv {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
