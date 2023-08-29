import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { EFFECTS_MANAGER } from './tokens';
import { Actions as _Actions } from './actions';
import {
  initEffects,
  EffectsConfig,
  actions,
  Actions,
  EffectsManager,
} from '@ngneat/effects';

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
      provide: _Actions,
      useExisting: Actions,
    },
    {
      provide: EffectsManager,
      useValue: manager,
    },
    {
      provide: EFFECTS_MANAGER,
      useExisting: EffectsManager,
    },
  ]);
}
