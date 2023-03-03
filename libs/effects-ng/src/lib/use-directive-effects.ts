import { Directive, Type, inject, OnDestroy } from '@angular/core';
import { EFFECTS_MANAGER } from './tokens';
import { getEffectPropsMap } from './utils';
import { Effect } from '@ngneat/effects';
import {
  isEffectProvided,
  increaseProvidedEffectSources,
  provideEffect,
  decreaseProvidedEffectSources,
  generateProvidedEffectToken,
  ProvidedEffectToken,
  getProvideEffectByToken,
} from './provided-effects-map';

export function useDirectiveEffects(...providers: Type<any>[]): Type<unknown> {
  @Directive({
    standalone: true,
    providers,
  })
  class InitEffectsDirective implements OnDestroy {
    private readonly manager = inject(EFFECTS_MANAGER, { optional: true });
    private readonly providersEffectsTokens = new Set<ProvidedEffectToken>();

    constructor() {
      if (!this.manager) {
        throw new TypeError(
          "Effects manager wasn't found. Have you forgotten to provide it? Please call `provideEffectsManager` in the root providers."
        );
      }

      const effects: Effect[] = [];

      new Set(providers).forEach((provider) => {
        const instance = inject(provider, { self: true });

        getEffectPropsMap(instance).forEach((effect, key) => {
          const token = generateProvidedEffectToken(provider, key);

          this.providersEffectsTokens.add(token);

          if (isEffectProvided(token)) {
            increaseProvidedEffectSources(token);
          } else {
            provideEffect(token, effect);

            effects.push(effect);
          }
        });
      });

      if (effects.length) {
        this.manager?.registerEffects(effects);
      }
    }

    ngOnDestroy(): void {
      this.unregisterEffect();
    }

    private unregisterEffect(): void {
      const effects = [...this.providersEffectsTokens].reduce<Effect[]>(
        (effects, token) => {
          const effect = getProvideEffectByToken(token);

          decreaseProvidedEffectSources(token);

          if (effect && !isEffectProvided(token)) {
            effects.push(effect);
          }

          return effects;
        },
        []
      );

      this.manager?.removeEffects(effects);
    }
  }

  return InitEffectsDirective;
}
