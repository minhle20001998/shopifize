import { DataSource, Comment } from '@shopifize/database';

export const COMMENT_REPOSITORY = 'COMMENT_REPOSITORY';

export const commentProviders = [
  {
    provide: COMMENT_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Comment),
    inject: ['DATA_SOURCE'],
  },
];
