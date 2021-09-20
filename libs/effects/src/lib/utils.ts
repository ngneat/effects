import { Effect }     from './effects.types';
import { Observable } from 'rxjs';

export function coerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function isEffect(effect: Effect): effect is Effect {
  return effect.source instanceof Observable;
}
