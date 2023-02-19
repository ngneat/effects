import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { Action } from './actions.types';

export function toProps<T extends Action>(): OperatorFunction<
  T,
  Omit<T, 'type'>
> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return map(({ type, ...props }) => props);
}
