import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class CookieToHeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: any) => void) {
    const access_token = req.cookies['access_token'];
    req.headers.authorization = `Bearer ${access_token}`;
    next();
  }
}
