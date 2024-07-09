import { Inject, Injectable } from '@nestjs/common';
import {
  CART_ITEM_REPOSITORY,
  CreateOrderDto,
  ORDER_ITEM_REPOSITORY,
  ORDER_REPOSITORY,
  PAYMENT_REPOSITORY,
} from '@shopifize/custom-nestjs';
import {
  CartItem,
  Order,
  ORDER_STATUS,
  OrderItem,
  Payment,
  PAYMENT_STATUS,
  Repository,
  User,
} from '@shopifize/database';
import {
  OrderStatus,
  PaymentStatus,
  ShopifizedError,
} from '@shopifize/helpers';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private OrderDatabase: Repository<Order>,
    @Inject(CART_ITEM_REPOSITORY)
    private CartItemDatabase: Repository<CartItem>,
    @Inject(ORDER_ITEM_REPOSITORY)
    private OrderItemDatabase: Repository<OrderItem>,
    @Inject(PAYMENT_REPOSITORY)
    private PaymentDatabase: Repository<Payment>,
  ) {}

  ping() {
    return 'ping order';
  }

  async getOrders(user: User) {
    const orders = await this.OrderDatabase.find({
      relations: {
        user: true,
        items: {
          product: true,
          product_variant: true,
        },
        payment: true,
      },
      where: {
        user: {
          id: user.id,
        },
      },
    });

    return orders;
  }

  async getOrder(id: string, user: User) {
    const order = await this.OrderDatabase.findOne({
      where: {
        id: id,
        user: {
          id: user.id,
        },
      },
      relations: {
        user: true,
        items: true,
        payment: true,
      },
    });

    return order;
  }

  async createOrder(user: User, { cartItemIds }: CreateOrderDto) {
    //
    const order = await this.OrderDatabase.save(
      this.OrderDatabase.create({
        user,
        total_price: 0,
      }),
    );

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
    let totalPrice = 0;

    cartItems.forEach((cartItem) => {
      if (cartItem.cart.user.id !== user.id) {
        throw new ShopifizedError('Cart Item does not belong to this user');
      }

      totalPrice =
        totalPrice + cartItem.product_variant.price * cartItem.quantity;

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

    await this.OrderDatabase.update(order.id, { total_price: totalPrice });

    await this.CartItemDatabase.remove(cartItems);

    console.log({ totalPrice });

    const payment = this.PaymentDatabase.create({
      amount: totalPrice,
      status: PAYMENT_STATUS.COMPLETED,
      order,
    });

    await this.PaymentDatabase.save(payment);
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
