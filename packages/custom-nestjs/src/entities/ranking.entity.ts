import { DataSource, Ranking } from '@shopifize/database';

export const RANKING_REPOSITORY = 'RANKING_REPOSITORY';

export const rankingProviders = [
  {
    provide: RANKING_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Ranking),
    inject: ['DATA_SOURCE'],
  },
];
