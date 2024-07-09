import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import {
  AddCartItemDto,
  CART_ITEM_REPOSITORY,
  CART_REPOSITORY,
} from '@shopifize/custom-nestjs';
import {
  Cart,
  CartItem,
  Repository,
  User,
  UserRole,
} from '@shopifize/database';
import { ShopifizedError } from '@shopifize/helpers';

@Injectable()
export class CartService {
  constructor(
    @Inject(CART_REPOSITORY)
    private CartDatabase: Repository<Cart>,
    @Inject(CART_ITEM_REPOSITORY)
    private CartItemDatabase: Repository<CartItem>,
  ) {}

  ping() {
    return 'ping cart';
  }

  async getCartItems(user: User) {
    const cart = await this.CartDatabase.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
      relations: {
        cart_item: { product: true, product_variant: true },
      },
    });

    return cart;
  }

  async addItemToCart(user: User, cartItemRequest: AddCartItemDto) {
    let cart = await this.CartDatabase.findOne({
      where: {
        user: user,
      },
    });

    if (!cart) {
      cart = await this.createCart(user);
    }

    const cartItemInstance = this.CartItemDatabase.create({
      product: { id: cartItemRequest.productId },
      cart: { id: cart.id },
      product_variant: { id: cartItemRequest.productVariantId },
      quantity: cartItemRequest.quantity,
    });

    await this.CartItemDatabase.save(cartItemInstance);
  }

  async removeItemFromCart(user: User, cartItemId: string) {
    const cartItem = await this.CartItemDatabase.findOne({
      where: {
        id: cartItemId,
      },
      relations: {
        cart: {
          user: true,
        },
      },
    });

    if (!cartItem) {
      throw new ShopifizedError('Cart item does not exist');
    }

    const hasAuthority = this.checkDeletionAuthority(
      cartItem.cart.user.id,
      user,
    );

    if (!hasAuthority) {
      throw new ForbiddenException();
    }

    await this.CartItemDatabase.remove(cartItem);
    return true;
  }

  async removeItemsFromCart(user: User, cartItemsId: string[]) {
    const promises = cartItemsId.map((item) => {
      return this.removeItemFromCart(user, item);
    });

    await Promise.all(promises);
    return true;
  }

  async createCart(user: User) {
    const cartInstance = this.CartDatabase.create({ user });
    const cart = await this.CartDatabase.save(cartInstance);
    return cart;
  }

  checkDeletionAuthority(id: string, user: User) {
    if (user.roles.map((role) => role.role).includes(UserRole.ADMIN)) {
      return true;
    }

    return user.id === id;
  }
}
