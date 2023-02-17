import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { Actions } from './actions';
import { EFFECTS_MANAGER } from './tokens';
import { initEffects, EffectsConfig, actions } from '@ngneat/effects';

/**
 * Must be called at the root level.
 */
export function provideEffectsManager(
  config?: EffectsConfig
): EnvironmentProviders {
  const { dispatchByDefault = false, customActionsStream = actions } =
    config || {};
  const manager = initEffects({ dispatchByDefault, customActionsStream });

  return makeEnvironmentProviders([
    {
      provide: Actions,
      useValue: customActionsStream,
    },
    {
      provide: EFFECTS_MANAGER,
      useValue: manager,
    },
  ]);
}
