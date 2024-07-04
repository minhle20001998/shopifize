import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import {
  AddCartItemDto,
  JwtAuthGuard,
  UserParam,
  UUIDDto,
} from '@shopifize/custom-nestjs';
import { User } from '@shopifize/database';
import { generateResponse } from '@shopifize/helpers';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('ping')
  ping() {
    return this.cartService.ping();
  }

  @Get('user/items')
  @UseGuards(JwtAuthGuard)
  async getCartItemsForUser(@UserParam() user: User) {
    const data = await this.cartService.getCartItems(user);
    return generateResponse(data, true);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async addItemToCart(
    @UserParam() user: User,
    @Body() cartItem: AddCartItemDto,
  ) {
    await this.cartService.addItemToCart(user, cartItem);
    return generateResponse(null, true);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeItemFromCart(@UserParam() user: User, @Param() { id }: UUIDDto) {
    await this.cartService.removeItemFromCart(user, id);
    return generateResponse(null, true);
  }
}
