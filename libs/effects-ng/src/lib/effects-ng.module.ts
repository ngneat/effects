import { Inject, InjectionToken, Injector, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { EFFECTS_MANAGER }                                                       from './tokens';
import { EffectsConfig, EffectsManager }                                         from '../../../effects/src/lib/effects-manager';
import { isEffect }                                                              from '../../../effects/src/lib/utils';
import { Actions }                                                               from './actions';
import { actions }                                                               from '@ngneat/effects';

const registeredEffects = new WeakSet();

// @NgModule({})
// export class EffectsNgModule {
//
//   static forRoot(
//     rootEffects: Type<any>[] = [],
//     config?: EffectsConfig
//   ): ModuleWithProviders<EffectsRootModule> {
//     return {
//       ngModule: EffectsRootModule,
//       providers: [
//         {
//           provide: EFFECTS_MANAGER,
//           useFactory: () => new EffectsManager(config)
//         },
//         {
//           provide: Actions,
//           useValue: actions
//         },
//         rootEffects,
//         {
//           provide: _ROOT_EFFECTS,
//           useValue: [rootEffects]
//         },
//         {
//           provide: ROOT_EFFECT_INSTANCES,
//           useFactory: createEffectInstances,
//           deps: [Injector, _ROOT_EFFECTS]
//         }
//       ]
//     };
//   }
//
//   static forFeature(featureEffects: Type<any>[] = []): ModuleWithProviders<EffectsFeatureModule> {
//     return {
//       ngModule: EffectsFeatureModule,
//       providers: [
//         featureEffects,
//         {
//           provide: _FEATURE_EFFECTS,
//           useValue: featureEffects,
//           multi: true
//         },
//         {
//           provide: FEATURE_EFFECT_INSTANCES,
//           multi: true,
//           useFactory: createEffectInstances,
//           deps: [Injector, _FEATURE_EFFECTS]
//         }
//       ]
//     };
//   }
// }

export function createEffectInstances(
  effectsManager: EffectsManager,
  injector: Injector,
  effectGroups: Type<any>[]
): InstanceType<any>[] {
  const mergedEffects: Type<any>[] = effectGroups;

  const effectInstances = mergedEffects.reduce((acc, effect) => {
    if (!registeredEffects.has(effect)) {
      registeredEffects.add(effect);
      acc.push(injector.get(effect));
    }
    return acc;
  }, [] as InstanceType<any>);

  console.log(effectInstances);

  effectGroups.forEach(effectInstance => {
    Object.keys(effectInstance).forEach(propertyName => {
      const effect = effectInstance[propertyName];
      if (isEffect(effect)) {
        console.log('register', effect);
        effectsManager.registerEffects([effect]);
      }
    });
  });

  return effectInstances;
}

export const EFFECTS_PROVIDERS = new InjectionToken('EFFECTS_PROVIDERS');

@NgModule({})
export class EffectsNgModule {
  constructor(
    @Inject(EFFECTS_PROVIDERS) providers: Type<any>[]
  ) {

  }

  static forRoot(
    providers: Type<any>[],
    config?: EffectsConfig
  ): ModuleWithProviders<EffectsNgModule> {

    return {
      ngModule: EffectsNgModule,
      providers: [
        {
          provide: EFFECTS_MANAGER,
          useFactory: () => new EffectsManager(config)
        },
        {
          provide: Actions,
          useValue: actions
        },
        ...providers,
        {
          provide: EFFECTS_PROVIDERS,
          multi: true,
          useFactory: (effectsManager, injector) =>
            createEffectInstances(effectsManager, injector, providers),
          deps: [EFFECTS_MANAGER, Injector]
        }
      ]
    };
  }

  static forFeature(
    providers: (Type<any>)[]
  ): ModuleWithProviders<EffectsNgModule> {
    return EffectsNgModule.forRoot(providers);
  }

}
