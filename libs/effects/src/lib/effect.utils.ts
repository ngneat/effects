import {Observable} from "rxjs";
import {actions, Actions} from "./actions";
import {effectsManager} from "./effects";
import {Effect, EffectConfig} from "./effect.model";

export function createEffect(
  factory: (actions: Actions) => Observable<any>,
  config?: EffectConfig
): Effect {
  return {callback: factory(actions), config}
}

export function registerEffects(effects: Effect | Effect[]) {
  effectsManager.registerEffects(coerceArray(effects))
}

export function removeEffects(effects: Effect | Effect[]) {
  effectsManager.removeEffects(coerceArray(effects))
}

export function removeAllEffects() {
  effectsManager.removeAllEffects()
}

function coerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}
