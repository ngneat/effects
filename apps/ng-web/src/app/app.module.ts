import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { EffectsNgModule } from '@ngneat/effects-ng';
import { TestEffects } from './state/test.effects';
import { EagerComponent } from './eager/eager.component';
import { EagerModule } from './eager/eager.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'eager',
        component: EagerComponent
      },
      {
        path: 'lazy',
        loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule)
      }
    ]),
    EffectsNgModule.forRoot([TestEffects]),
    EagerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
