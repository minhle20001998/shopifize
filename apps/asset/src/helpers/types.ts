import { GlobalEnv } from '@shopifize/custom-nestjs';

export class Env extends GlobalEnv {
  port: string;
  s3: {
    aws_access_key: string;
    aws_secret_key: string;
    bucket_region: string;
    bucket: string;
    bucket_endpoint: string;
  };
}
