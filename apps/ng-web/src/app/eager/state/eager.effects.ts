import { Injectable } from '@angular/core';
import { createEffect } from '@ngneat/effects';
import { ofType } from 'ts-action-operators';
import { tap } from 'rxjs';
import { eagerActionOne, eagerActionTwo } from './eager.actions';

@Injectable()
export class EagerEffects {
  eagerEffectOne$ = createEffect(
    (actions) =>
      actions.pipe(
        ofType(eagerActionOne),
        tap((payload) => console.log('eager effect', payload))
      ),
    { dispatch: false }
  );

  eagerEffectTwo$ = createEffect((actions) =>
    actions.pipe(
      ofType(eagerActionTwo),
      tap((payload) => console.log('eager effect', payload))
    )
  );
}
