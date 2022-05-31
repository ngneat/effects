import { Injectable } from '@angular/core';
import { createEffect } from '@ngneat/effects';

import { ofType } from 'ts-action-operators';
import { lazyActionTwo } from './lazy.actions';
import { tap } from 'rxjs';
import { LazyService } from './lazy.service';

@Injectable()
export class LazyEffects {
  constructor(private service: LazyService) {
    console.log('construct', service);
  }

  lazyEffectOne$ = createEffect((actions) =>
    actions.pipe(
      ofType(lazyActionTwo),
      tap((payload) => console.log('effect', payload))
    )
  );
}
