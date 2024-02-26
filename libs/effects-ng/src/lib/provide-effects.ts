import {
  Type,
  ENVIRONMENT_INITIALIZER,
  inject,
  makeEnvironmentProviders,
  EnvironmentProviders,
} from '@angular/core';
import { getEffectPropsMap } from './utils';
import { Effect, EffectsManager } from '@ngneat/effects';
import {
  provideEffect,
  increaseProvidedEffectSources,
  generateProvidedEffectToken,
  isEffectProvided,
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
        const manager = inject(EffectsManager, { optional: true });

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
      const sourceInstance = Object.getPrototypeOf(instance);
      const token = generateProvidedEffectToken(provider, key);

      if (isEffectProvided(sourceInstance, token)) {
        increaseProvidedEffectSources(sourceInstance, token);
      } else {
        provideEffect(sourceInstance, token, effect);

        effects.push(effect);
      }
    });

    manager.registerEffects(effects);
  });
}
