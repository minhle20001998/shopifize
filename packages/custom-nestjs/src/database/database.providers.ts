import Database from '@shopifize/database';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return Database.initialize();
    },
  },
];
