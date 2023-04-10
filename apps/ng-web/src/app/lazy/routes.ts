import { provideEffects } from '@ngneat/effects-ng';
import { LazyComponent } from './lazy.component';
import { Routes } from '@angular/router';
import { LazyEffects } from './state/lazy.effects';

export const ROUTES: Routes = [
  {
    path: '',
    component: LazyComponent,
    providers: [provideEffects(LazyEffects)],
  },
];
