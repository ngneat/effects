import { Injectable } from '@angular/core';
import { createEffect } from '@ngneat/effects';
import { ofType } from 'ts-action-operators';
import { testActionTwo } from './test.actions';
import { tap } from 'rxjs';

@Injectable()
export class TestEffects {
  constructor() {
    console.log('TestEffects constructor');
  }

  testEffectOne$ = createEffect((actions) =>
    actions.pipe(
      ofType(testActionTwo),
      tap((payload) => console.log('effect', payload))
    )
  );
}
