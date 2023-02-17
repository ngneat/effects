import {
  Type,
  ENVIRONMENT_INITIALIZER,
  inject,
  makeEnvironmentProviders,
  EnvironmentProviders,
} from '@angular/core';
import { EFFECTS_MANAGER } from './tokens';
import { retrieveOnlyEffects } from './utils';

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
        const manager = inject(EFFECTS_MANAGER);

        if (!manager) {
          throw new TypeError(
            "Effects manager wasn't found. Have you forgotten to provide it? Please call `provideEffectsManager` in the root providers."
          );
        }

        providers.forEach((provider) => {
          const instance = inject(provider);
          const effects = retrieveOnlyEffects(instance);

          manager.registerEffects(effects);
        });
      },
    },
  ]);
}
