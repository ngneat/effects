import { Injector, ModuleWithProviders, NgModule, Type }                                                     from '@angular/core';
import { _FEATURE_EFFECTS, _ROOT_EFFECTS, EFFECTS_MANAGER, FEATURE_EFFECT_INSTANCES, ROOT_EFFECT_INSTANCES } from './tokens';
import { EffectsRootModule }                                                                                 from './effect-root.module';
import { EffectsFeatureModule }                                                                              from './effect-feature.module';
import {
  EffectsConfig,
  EffectsManager
}                                                                                                            from '../../../effects/src/lib/effects-manager';
import { Actions }                                                                                           from './actions';
import { actions }                                                                                           from '@ngneat/effects';

const registeredEffects = new WeakSet();

@NgModule({})
export class EffectsNgModule {

  static forRoot(
    rootEffects: Type<any>[] = [],
    config?: EffectsConfig
  ): ModuleWithProviders<EffectsRootModule> {
    return {
      ngModule: EffectsRootModule,
      providers: [
        {
          provide: EFFECTS_MANAGER,
          useFactory: () => new EffectsManager(config)
        },
        {
          provide: Actions,
          useValue: actions
        },
        rootEffects,
        {
          provide: _ROOT_EFFECTS,
          useValue: [rootEffects]
        },
        {
          provide: ROOT_EFFECT_INSTANCES,
          useFactory: createEffectInstances,
          deps: [Injector, _ROOT_EFFECTS]
        }
      ]
    };
  }

  static forFeature(featureEffects: Type<any>[] = []): ModuleWithProviders<EffectsFeatureModule> {
    return {
      ngModule: EffectsFeatureModule,
      providers: [
        featureEffects,
        {
          provide: _FEATURE_EFFECTS,
          useValue: featureEffects,
          multi: true
        },
        {
          provide: FEATURE_EFFECT_INSTANCES,
          multi: true,
          useFactory: createEffectInstances,
          deps: [Injector, _FEATURE_EFFECTS]
        }
      ]
    };
  }
}

export function createEffectInstances(injector: Injector, effectGroups: Type<any>[][]): InstanceType<any>[] {
  const mergedEffects: Type<any>[] = [];

  for (const effectGroup of effectGroups) {
    mergedEffects.push(...effectGroup);
  }

  // todo we shouldn't use a map to avoid registering the effects twice;
  // fix the underlying issue for feature is called twice
  const effectInstances = mergedEffects.reduce((acc, effect) => {
    if (!registeredEffects.has(effect)) {
      registeredEffects.add(effect);
      acc.push(injector.get(effect));
    }
    return acc;
  }, [] as InstanceType<any>);

  return effectInstances;
}
