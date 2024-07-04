import { DataSource, Cart } from '@shopifize/database';

export const CART_REPOSITORY = 'CART_REPOSITORY';

export const cartProviders = [
  {
    provide: CART_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Cart),
    inject: ['DATA_SOURCE'],
  },
];
