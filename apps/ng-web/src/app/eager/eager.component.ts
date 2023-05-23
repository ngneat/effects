import { Component } from '@angular/core';
import {
  Actions,
  provideDirectiveEffects,
  EffectsDirective,
} from '@ngneat/effects-ng';
import { eagerActionOne } from './state/eager.actions';
import { EagerEffects } from './state/eager.effects';

@Component({
  selector: 'effects-root',
  template: ` <div>Eager component loaded</div> `,
  providers: [provideDirectiveEffects(EagerEffects)],
  hostDirectives: [EffectsDirective],
  standalone: true,
})
export class EagerComponent {
  constructor(private actions: Actions) {
    this.actions.dispatch(eagerActionOne());
  }
}
