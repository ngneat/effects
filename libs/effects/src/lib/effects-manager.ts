import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Actions, actions } from './actions';
import { Action } from './actions.types';
import { Effect } from './effects.types';
import { coerceArray } from './utils';

export interface EffectsConfig {
  dispatchByDefault?: boolean;
  customActionsStream?: Actions;
}

export class EffectsManager {
  private effects = new WeakMap<Effect, Subscription>();
  private destroyEffects$ = new Subject<void>();
  private config: EffectsConfig;

  constructor(config?: EffectsConfig) {
    this.config = {
      dispatchByDefault: false,
      ...config,
    };
  }

  registerEffects(effects: Effect[]) {
    effects.forEach((effect) => {
      this.subscribeEffect(effect);
    });
  }

  removeEffects(effects: Effect[]) {
    effects.forEach((effect) => {
      this.unsubscribeEffect(effect);
    });
  }

  removeAllEffects() {
    this.destroyEffects$.next();
    this.effects = new WeakMap();
  }

  private subscribeEffect(effect: Effect) {
    const source = effect.sourceFn(this.config.customActionsStream || actions);

    const sub = source
      .pipe(takeUntil(this.destroyEffects$))
      .subscribe((maybeActions) => {
        if (effect.config?.dispatch ?? this.config.dispatchByDefault) {
          const coercedMaybeActions = coerceArray(maybeActions);
          const onlyActions = coercedMaybeActions.filter((maybeAction) =>
            checkAction(maybeAction)
          );
          if (onlyActions.length) {
            actions.dispatch(...onlyActions);
          }
        }
      });

    this.effects.set(effect, sub);
  }

  private unsubscribeEffect(effect: Effect) {
    const sub = this.effects.get(effect);
    sub?.unsubscribe();
    this.effects.delete(effect);
  }
}

function checkAction(action: unknown): action is Action {
  return !!(
    typeof action === 'object' &&
    action !== null &&
    (action as Action).type
  );
}

export let effectsManager: EffectsManager;

export function initEffects(config?: EffectsConfig) {
  if (effectsManager) {
    return effectsManager;
  }

  return (effectsManager = new EffectsManager(config));
}

export function registerEffects(effects: Effect | Effect[]) {
  effectsManager.registerEffects(coerceArray(effects));
}

export function removeEffects(effects: Effect | Effect[]) {
  effectsManager.removeEffects(coerceArray(effects));
}

export function removeAllEffects() {
  effectsManager.removeAllEffects();
}
