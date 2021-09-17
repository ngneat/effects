import { Effect }     from '../../../effects/src/lib/effects.types';
import { Observable } from 'rxjs';

export function isEffect(effect: Effect): effect is Effect {
  return effect.source instanceof Observable
}
