import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Effect, EffectConfig } from './effects.types';
import { Action } from './actions.types';
import { Actions, actions } from './actions';
import { coerceArray } from './utils';

interface EffectsConfig {
  dispatchByDefault?: boolean;
}

export class EffectsManager {
  private effects = new WeakMap<Effect, Subject<void>>();
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
    this.effects = new WeakMap<Effect, Subject<void>>();
  }

  private subscribeEffect(effect: Effect) {
    const disposer = new Subject<void>();
    this.effects.set(effect, disposer);

    effect.source
      .pipe(takeUntil(this.destroyEffects$), takeUntil(disposer))
      .subscribe((maybeAction) => {
        if (
          effect.config?.dispatch ||
          (this.config.dispatchByDefault && checkAction(maybeAction))
        ) {
          actions.dispatch(maybeAction);
        }
      });
  }

  private unsubscribeEffect(effect: Effect) {
    const disposer = this.effects.get(effect);
    disposer?.next();
    this.effects.delete(effect);
  }
}

function checkAction(
  action: Action | any
): action is Action & Record<'type', any> {
  if (action.type) {
    return true;
  }
  throw new TypeError(
    'Make sure to provide a valid action type or set the option {dispatch: false}'
  );
}

export let effectsManager: EffectsManager;

export function initEffects(config?: EffectsConfig) {
  return (effectsManager = new EffectsManager(config));
}

export function createEffect(
  factory: (actions: Actions) => Observable<any>,
  config?: EffectConfig
): Effect {
  return { source: factory(actions), config };
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
