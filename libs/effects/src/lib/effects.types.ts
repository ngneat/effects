import { Observable } from 'rxjs';
import { Actions } from './actions';

export interface EffectConfig {
  dispatch: boolean;
}

export interface Effect<T = any> {
  sourceFn: (actions: Actions) => Observable<T>;
  config?: EffectConfig;
}
