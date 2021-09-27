import { Component } from '@angular/core';
import { Actions } from '@ngneat/effects-ng';
import { lazyActionTwo } from './state/lazy.actions';

@Component({
  selector: 'effects-root',
  template: `
    <div>
      Lazy component loaded
    </div>
  `
})
export class LazyComponent {

  constructor(
    private actions: Actions
  ) {
    this.actions.dispatch(lazyActionTwo({ lazy: 'lazy action payload' }));
  }
}
