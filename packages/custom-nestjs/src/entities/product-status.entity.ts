import { DataSource, ProductStatus } from '@shopifize/database';

export const PRODUCT_STATUS_REPOSITORY = 'PRODUCT_STATUS_REPOSITORY';

export const productStatusProviders = [
  {
    provide: PRODUCT_STATUS_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductStatus),
    inject: ['DATA_SOURCE'],
  },
];
