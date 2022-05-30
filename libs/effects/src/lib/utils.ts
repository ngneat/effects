import { Observable } from 'rxjs';
import { Actions } from './actions';
import { Effect } from './effects.types';

export function coerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function isEffect(effect: Effect): effect is Effect {
  return (
    typeof effect.sourceFn === 'function' &&
    effect.sourceFn(new Actions()) instanceof Observable
  );
}
