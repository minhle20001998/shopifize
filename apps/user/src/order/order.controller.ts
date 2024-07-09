import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  JwtAuthGuard,
  UserParam,
  UUIDDto,
} from '@shopifize/custom-nestjs';
import { User } from '@shopifize/database';
import { generateResponse } from '@shopifize/helpers';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('ping')
  ping() {
    return this.orderService.ping();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrders(@UserParam() user: User) {
    const data = await this.orderService.getOrders(user);
    return generateResponse(data, true);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@UserParam() user: User, @Param() { id }: UUIDDto) {
    const data = await this.orderService.getOrder(id, user);
    return generateResponse(data, true);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@UserParam() user: User, @Body() order: CreateOrderDto) {
    await this.orderService.createOrder(user, order);
    return generateResponse(null, true);
  }

  updateOrder() {
    //
  }

  updateOrderStatus() {
    //
  }

  deleteOrder() {
    //
  }
}
