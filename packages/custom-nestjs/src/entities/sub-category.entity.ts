import { DataSource, SubCategory } from '@shopifize/database';

export const SUB_CATEGORY_REPOSITORY = 'SUB_CATEGORY_REPOSITORY';

export const subCategoryProviders = [
  {
    provide: SUB_CATEGORY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SubCategory),
    inject: ['DATA_SOURCE'],
  },
];
