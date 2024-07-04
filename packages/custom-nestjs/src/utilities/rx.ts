import { ResponseType } from '@shopifize/helpers';
import { Observable, lastValueFrom } from 'rxjs';
import { LastValueFromConfig } from 'rxjs/internal/lastValueFrom';

export function getMessage<T, D = any>(
  source: Observable<ResponseType<T>>,
  config?: LastValueFromConfig<D>,
): Promise<ResponseType<T>> {
  if (config) {
    return lastValueFrom<ResponseType<T>, D>(source, config) as Promise<
      ResponseType<T>
    >;
  } else {
    return lastValueFrom<ResponseType<T>>(source);
  }
}
