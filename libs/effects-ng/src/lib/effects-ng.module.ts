import { Inject, ModuleWithProviders, NgModule, Type } from '@angular/core';
import {
  Actions,
  actions,
  EffectsConfig,
  EffectsManager,
  initEffects,
} from '@ngneat/effects';
import { EFFECTS_MANAGER, EFFECTS_PROVIDERS } from './tokens';
import { registerEffectFromProviders } from './provide-effects';
import { Actions as _Actions } from './actions';

/**
 * @deprecated Please consider using `provideEffectsManager` and `provideEffects` functions instead. This module will be
 *   deleted in the future.
 */
@NgModule()
export class EffectsNgModule {
  constructor(
    @Inject(EFFECTS_MANAGER) manager: EffectsManager,
    @Inject(EFFECTS_PROVIDERS) providers: Type<any>[]
  ) {
    registerEffectFromProviders(flatten(providers), manager);
  }

  static forRoot(
    providers: Type<any>[],
    config?: EffectsConfig
  ): ModuleWithProviders<EffectsNgModule> {
    return {
      ngModule: EffectsNgModule,
      providers: [
        {
          provide: Actions,
          useValue: config?.customActionsStream || actions,
        },
        {
          provide: _Actions,
          useExisting: Actions,
        },
        {
          provide: EffectsManager,
          useFactory: () => initEffects(config),
        },
        {
          provide: EFFECTS_MANAGER,
          useExisting: EffectsManager,
        },
        ...providers,
        {
          provide: EFFECTS_PROVIDERS,
          multi: true,
          useValue: providers,
        },
      ],
    };
  }

  static forFeature(
    providers: Type<any>[]
  ): ModuleWithProviders<EffectsNgModule> {
    return EffectsNgModule.forRoot(providers);
  }
}

function flatten<T>(arr: T[]): T[] {
  return arr.reduce(
    (acc, cur) => acc.concat(Array.isArray(cur) ? flatten(cur) : (cur as any)),
    []
  );
}
