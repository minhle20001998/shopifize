import { DataSource, Profile } from '@shopifize/database';

export const PROFILE_REPOSITORY = 'PROFILE_REPOSITORY';

export const profileProviders = [
  {
    provide: PROFILE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Profile),
    inject: ['DATA_SOURCE'],
  },
];
