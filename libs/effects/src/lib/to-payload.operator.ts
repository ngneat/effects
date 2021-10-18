import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { Action } from './actions.types';

export function toPayload<T extends Action>(): OperatorFunction<T, Omit<T, 'type'>> {
  return source => source.pipe(
    map((action) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { type, ...payload } = action;
      return payload;
    })
  );
}
