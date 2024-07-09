import { DataSource, Payment } from '@shopifize/database';

export const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';

export const paymentProviders = [
  {
    provide: PAYMENT_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Payment),
    inject: ['DATA_SOURCE'],
  },
];
