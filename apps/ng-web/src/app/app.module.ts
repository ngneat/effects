import { HttpClientModule } from '@angular/common/http';
import { NgModule }         from '@angular/core';
import { FormsModule }      from '@angular/forms';
import { BrowserModule }    from '@angular/platform-browser';
import { RouterModule }     from '@angular/router';
import { EffectsNgModule }  from '@ngneat/effects-ng';
import { AppComponent }     from './app.component';
import { EagerComponent }   from './eager/eager.component';
import { EagerModule }      from './eager/eager.module';
import { TestEffects }      from './state/test.effects';
import { TodoEffects }      from './todo/+state/todo.effects';
import { TodoComponent }    from './todo/todo.component';

@NgModule({
  declarations: [AppComponent, TodoComponent],
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
    EffectsNgModule.forRoot([TestEffects, TodoEffects]),
    EagerModule,
    HttpClientModule,
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
