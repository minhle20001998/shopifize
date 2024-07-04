import { GlobalEnv } from '@shopifize/custom-nestjs';
export type TokenType = {
  refreshToken: string;
  accessToken: string;
};

export class Env extends GlobalEnv {
  port: string;
}
