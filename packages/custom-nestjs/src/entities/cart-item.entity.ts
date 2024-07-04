import { DataSource, CartItem } from '@shopifize/database';

export const CART_ITEM_REPOSITORY = 'CART_ITEM_REPOSITORY';

export const cartItemProviders = [
  {
    provide: CART_ITEM_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CartItem),
    inject: ['DATA_SOURCE'],
  },
];
