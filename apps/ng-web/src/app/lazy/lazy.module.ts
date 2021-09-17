import { NgModule }        from '@angular/core';
import { EffectsNgModule } from '@ngneat/effects-ng';
import { LazyComponent }   from './lazy.component';
import { RouterModule }    from '@angular/router';
import { LazyEffects }     from './+state/lazy.effects';

@NgModule({
  declarations: [LazyComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LazyComponent
      }
    ]),
    EffectsNgModule.forFeature([LazyEffects])
  ]
})
export class LazyModule {
}
