import { DataSource, OrderItem } from '@shopifize/database';

export const ORDER_ITEM_REPOSITORY = 'ORDER_ITEM_REPOSITORY';

export const orderItemProviders = [
  {
    provide: ORDER_ITEM_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(OrderItem),
    inject: ['DATA_SOURCE'],
  },
];
