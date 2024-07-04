import { DataSource, Role } from '@shopifize/database';

export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';

export const roleProviders = [
  {
    provide: ROLE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Role),
    inject: ['DATA_SOURCE'],
  },
];
