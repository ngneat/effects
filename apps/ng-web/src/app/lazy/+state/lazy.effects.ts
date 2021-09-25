import { ChangeDetectorRef, Injectable } from '@angular/core';
import { createEffect }                  from '@ngneat/effects';
import { ofType }        from 'ts-action-operators';
import { lazyActionTwo } from './lazy.actions';
import { tap }           from 'rxjs';

@Injectable()
export class LazyEffects {

  constructor(
    private cd: ChangeDetectorRef
  ) {
    console.log("construct")
  }

  lazyEffectOne$ = createEffect(actions => actions.pipe(
    ofType(lazyActionTwo),
    tap((payload) => console.log('effect', payload))
  ));

  private testMethod() {
    console.log('whatever');
  }
}
