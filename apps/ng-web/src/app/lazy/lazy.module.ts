import { NgModule } from '@angular/core';
import { provideEffects } from '@ngneat/effects-ng';
import { LazyComponent } from './lazy.component';
import { RouterModule } from '@angular/router';
import { LazyEffects } from './state/lazy.effects';

@NgModule({
  declarations: [LazyComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LazyComponent,
      },
    ]),
  ],
  providers: [provideEffects(LazyEffects)],
})
export class LazyModule {}
