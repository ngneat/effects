import { NgModule } from '@angular/core';
import { EffectsNgModule } from '@ngneat/effects-ng';
import { EagerComponent } from './eager.component';
import { EagerEffects } from './state/eager.effects';

@NgModule({
  declarations: [EagerComponent],
  imports: [EffectsNgModule.forFeature([EagerEffects])],
  exports: [EagerComponent],
})
export class EagerModule {}
