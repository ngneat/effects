import { Component } from '@angular/core';
import { Actions } from '@ngneat/effects-ng';
import { eagerActionOne } from './+state/eager.actions';

@Component({
  selector: 'effects-root',
  template: `
    <div>
      Eager component loaded
    </div>
  `
})
export class EagerComponent {

  constructor(
    private actions$: Actions
  ) {
    this.actions$.dispatch(eagerActionOne());
  }
}
