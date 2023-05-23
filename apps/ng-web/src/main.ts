import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { FormsModule } from '@angular/forms';
import {
  withInterceptorsFromDi,
  provideHttpClient,
} from '@angular/common/http';
import { EagerComponent } from './app/eager/eager.component';
import { provideRouter } from '@angular/router';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { TodoEffects } from './app/todo/+state/todo.effects';
import { TestEffects } from './app/state/test.effects';
import { provideEffectsManager, provideEffects } from '@ngneat/effects-ng';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, FormsModule),
    provideEffectsManager(),
    provideEffects(TestEffects, TodoEffects),
    provideRouter([
      {
        path: 'eager',
        component: EagerComponent,
      },
      {
        path: 'lazy',
        loadChildren: () => import('./app/lazy/routes').then((m) => m.ROUTES),
      },
      {
        path: 'lazy-2',
        loadChildren: () =>
          import('./app/lazy-directive-effects/routes').then((m) => m.ROUTES),
      },
    ]),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
