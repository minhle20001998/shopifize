import { DataSource, Address } from '@shopifize/database';

export const ADDRESS_REPOSITORY = 'ADDRESS_REPOSITORY';

export const addressProviders = [
  {
    provide: ADDRESS_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Address),
    inject: ['DATA_SOURCE'],
  },
];
