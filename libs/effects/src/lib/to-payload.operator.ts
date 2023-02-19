import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { Action } from './actions.types';

export function toPayload<
  T extends Action & { payload: any }
>(): OperatorFunction<T, T['payload']> {
  return map(({ payload }) => payload);
}
