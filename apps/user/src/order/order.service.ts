import { Inject, Injectable } from '@nestjs/common';
import {
  CART_REPOSITORY,
  CreateOrderDto,
  ORDER_ITEM_REPOSITORY,
  ORDER_REPOSITORY,
} from '@shopifize/custom-nestjs';
import {
  CartItem,
  Order,
  ORDER_STATUS,
  OrderItem,
  Repository,
  User,
} from '@shopifize/database';
import { ShopifizedError } from '@shopifize/helpers';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private OrderDatabase: Repository<Order>,
    @Inject(CART_REPOSITORY)
    private CartItemDatabase: Repository<CartItem>,
    @Inject(ORDER_ITEM_REPOSITORY)
    private OrderItemDatabase: Repository<OrderItem>,
  ) {}

  ping() {
    return 'ping order';
  }

  async getOrders() {
    const orders = await this.OrderDatabase.find({
      relations: {
        user: true,
        items: true,
      },
    });

    return orders;
  }

  async getOrder(id: string) {
    const order = await this.OrderDatabase.findOne({
      where: {
        id: id,
      },
      relations: {
        user: true,
        items: true,
      },
    });

    return order;
  }

  async createOrder(user: User, { cartItemIds }: CreateOrderDto) {
    //
    const order = this.OrderDatabase.create({
      user,
    });

    await this.OrderDatabase.save(order);

    const cartItemsPromises = cartItemIds.map((id) =>
      this.CartItemDatabase.findOne({
        where: { id: id },
        relations: {
          product: true,
          product_variant: true,
          cart: {
            user: true,
          },
        },
      }),
    );
    const cartItems = await Promise.all(cartItemsPromises);

    const orderItems: OrderItem[] = [];

    cartItems.forEach((cartItem) => {
      if (cartItem.cart.user.id !== user.id) {
        throw new ShopifizedError('Cart Item does not belong to this user');
      }

      const orderItem = this.OrderItemDatabase.create({
        order,
        price: cartItem.product_variant.price,
        product: cartItem.product,
        product_variant: cartItem.product_variant,
        quantity: cartItem.quantity,
      });

      orderItems.push(orderItem);
    });

    await this.OrderItemDatabase.save(orderItems);
  }

  async updateOrderStatus(id: string, status: ORDER_STATUS) {
    //
    await this.OrderDatabase.update(id, { status });
  }

  async deleteOrder(id: string) {
    //
    const order = await this.OrderDatabase.findOne({ where: { id } });

    const orderItems = await this.OrderItemDatabase.find({
      where: {
        order: {
          id,
        },
      },
    });

    const orderItemRemovePromises = orderItems.map((item) => {
      return this.OrderItemDatabase.remove(item);
    });

    await Promise.all(orderItemRemovePromises);

    await this.OrderDatabase.remove(order);
  }
}
