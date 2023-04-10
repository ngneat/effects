import { Component } from '@angular/core';
import {
  Actions,
  provideDirectiveEffects,
  EffectsDirective,
} from '@ngneat/effects-ng';
import { lazyDirectiveEffectsActionTwo } from './state/lazy.actions';
import { LazyDirectiveEffects } from './state/lazy.effects';

@Component({
  selector: 'effects-root',
  template: ` <div>Lazy component with directive effects loaded</div> `,
  providers: [provideDirectiveEffects(LazyDirectiveEffects)],
  hostDirectives: [EffectsDirective],
  standalone: true,
})
export class LazyDirectiveEffectsComponent {
  constructor(private actions: Actions) {
    this.actions.dispatch(
      lazyDirectiveEffectsActionTwo({ lazy: 'lazy action payload' })
    );
  }
}
