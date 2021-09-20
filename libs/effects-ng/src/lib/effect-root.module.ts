import { Inject, NgModule, Optional, SkipSelf }   from '@angular/core';
import { EFFECTS_MANAGER, ROOT_EFFECT_INSTANCES } from './tokens';
import { EffectsManager }                         from '../../../effects/src/lib/effects-manager';
import { isEffect }                               from '../../../effects/src/lib/utils';

@NgModule()
export class EffectsRootModule {
  constructor(
    @Inject(EFFECTS_MANAGER) private effectsManager: EffectsManager,
    @Inject(ROOT_EFFECT_INSTANCES) rootEffects: InstanceType<any>[],
    @Optional() @SkipSelf() private parentModule?: EffectsRootModule
  ) {
    this.rootGuard();

    rootEffects.forEach(effectInstance => {
      Object.keys(effectInstance).forEach(propertyName => {
        const effect = effectInstance[propertyName];
        if (isEffect(effect)) {
          this.effectsManager.registerEffects([effect]);
        }
      });
    });

  }

  rootGuard() {
    if (this.parentModule) {
      throw new Error('EffectsRootModule is already loaded. Import it in the AppModule only');
    }
  }
}
