import { DataSource, ProductVariant } from '@shopifize/database';

export const PRODUCT_VARIANT_REPOSITORY = 'PRODUCT_VARIANT_REPOSITORY';

export const productVariantProviders = [
  {
    provide: PRODUCT_VARIANT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductVariant),
    inject: ['DATA_SOURCE'],
  },
];
