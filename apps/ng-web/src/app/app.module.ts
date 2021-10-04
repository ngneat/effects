import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { AppComponent }     from './app.component';
import { RouterModule }     from '@angular/router';
import { EffectsNgModule }  from '@ngneat/effects-ng';
import { TestEffects }      from './state/test.effects';
import { EagerComponent }   from './eager/eager.component';
import { EagerModule }      from './eager/eager.module';
import { TodoComponent }    from './todo/todo.component';
import { TodoEffects }      from './todo/+state/todo.effects';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }      from '@angular/forms';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
