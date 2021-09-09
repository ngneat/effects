import { Observable } from 'rxjs';

export interface EffectConfig {
  dispatch: boolean;
}

export interface Effect {
  source: Observable<any>;
  config?: EffectConfig;
}
