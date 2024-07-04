import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeyOf, NestedValueOf, Paths } from './types';

@Injectable()
export class EnvService<T> {
  constructor(private readonly config: ConfigService<T, true>) {}

  get<K extends Paths<T, 2>>(name: K) {
    return this.config.get<unknown>(
      name as unknown as KeyOf<T>,
    ) as NestedValueOf<T, K>;
  }
}
