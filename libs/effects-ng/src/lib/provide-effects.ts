import {
  Type,
  ENVIRONMENT_INITIALIZER,
  inject,
  makeEnvironmentProviders,
  EnvironmentProviders,
} from '@angular/core';
import { EFFECTS_MANAGER } from './tokens';
import { getEffectPropsMap } from './utils';
import { Effect, EffectsManager } from '@ngneat/effects';
import {
  isEffectProvided,
  provideEffect,
  increaseProvidedEffectSources,
  generateProvidedEffectToken,
} from './provided-effects-map';

/**
 * Can be called at the root and feature levels.
 */
export function provideEffects(
  ...providers: Type<any>[]
): EnvironmentProviders {
  return makeEnvironmentProviders([
    ...providers,
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const manager = inject(EFFECTS_MANAGER, { optional: true });

        if (!manager) {
          throw new TypeError(
            "Effects manager wasn't found. Have you forgotten to provide it? Please call `provideEffectsManager` in the root providers."
          );
        }

        registerEffectFromProviders(providers, manager);
      },
    },
  ]);
}

export function registerEffectFromProviders(
  providers: Type<any>[],
  manager: EffectsManager
): void {
  new Set(providers).forEach((provider) => {
    const instance = inject(provider);
    const effects: Effect[] = [];

    getEffectPropsMap(instance).forEach((effect, key) => {
      const token = generateProvidedEffectToken(provider, key);

      if (isEffectProvided(token)) {
        increaseProvidedEffectSources(token);
      } else {
        provideEffect(token, effect);

        effects.push(effect);
      }
    });

    manager.registerEffects(effects);
  });
}
