import { Injectable }    from '@angular/core';
import { createEffect }  from '@ngneat/effects';
import { ofType }        from 'ts-action-operators';
import { lazyActionTwo } from './lazy.actions';
import { tap }           from 'rxjs';

@Injectable()
export class LazyEffects {

  lazyEffectOne$ = createEffect(actions => actions.pipe(
    ofType(lazyActionTwo),
    tap((payload) => console.log('effect', payload))
  ));

  private testMethod() {
    console.log('whatever');
  }
}
