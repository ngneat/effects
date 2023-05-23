import { Injectable } from '@angular/core';
import { createEffect } from '@ngneat/effects';

import { ofType } from 'ts-action-operators';
import { lazyDirectiveEffectsActionTwo } from './lazy.actions';
import { tap } from 'rxjs';
import { LazyDirectiveEffectsService } from './lazy.service';

@Injectable()
export class LazyDirectiveEffects {
  constructor(private service: LazyDirectiveEffectsService) {
    console.log('construct', service);
  }

  lazyEffectOne$ = createEffect((actions) =>
    actions.pipe(
      ofType(lazyDirectiveEffectsActionTwo),
      tap((payload) => console.log('effect', payload))
    )
  );
}
