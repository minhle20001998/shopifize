import { Controller, Get } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Get('ping')
  ping() {
    return 'pong';
  }
}
