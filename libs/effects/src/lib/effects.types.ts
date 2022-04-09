import { Observable } from 'rxjs';
import { Actions }    from './actions';

export interface EffectConfig {
  dispatch: boolean;
}

export interface Effect {
  sourceFn: (actions: Actions) => Observable<any>;
  config?: EffectConfig;
}
