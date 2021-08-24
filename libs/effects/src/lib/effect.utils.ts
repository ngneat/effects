import {Observable} from "rxjs";
import {actions$, Actions} from "./actions";
import {effectsManager} from "./effects";
import {Effect, EffectConfig} from "./effect.model";

export function createEffect(
  callback: (actions: Actions) => Observable<any>,
  config?: EffectConfig
): Effect {
  return {callback: callback(actions$), config}
}

export function registerEffects(effects: Effect[]) {
  effectsManager.registerEffects(effects)
}

export function removeEffects(effects: Effect[]) {
  effectsManager.removeEffects(effects)
}

export function removeAllEffects() {
  effectsManager.removeAllEffects()
}
