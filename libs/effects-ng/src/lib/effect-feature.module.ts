import { Inject, NgModule }                          from '@angular/core';
import { EFFECTS_MANAGER, FEATURE_EFFECT_INSTANCES } from './tokens';
import { EffectsManager }                            from '../../../effects/src/lib/effects-manager';
import { isEffect }                                  from '../../../effects/src/lib/utils';

@NgModule()
export class EffectsFeatureModule {
  constructor(
    @Inject(EFFECTS_MANAGER) private effectsManager: EffectsManager,
    @Inject(FEATURE_EFFECT_INSTANCES) featureEffects: InstanceType<any>[]
  ) {
    featureEffects.forEach((group) =>
      group.forEach((effectInstance) => {
        Object.keys(effectInstance).forEach(propertyName => {
          const effect = effectInstance[propertyName];
          if (isEffect(effect)) {
            this.effectsManager.registerEffects([effect]);
          }
        });
      })
    );
  }
}
