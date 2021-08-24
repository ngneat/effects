import {Observable} from "rxjs";

export interface EffectConfig {
  dispatch: boolean
}

export interface Effect {
  callback: Observable<any>;
  config?: EffectConfig
}
