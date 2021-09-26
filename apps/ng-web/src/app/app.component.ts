import { Component } from '@angular/core';
import { testActionTwo } from './state/test.actions';
import { Actions } from '@ngneat/effects-ng';

@Component({
  selector: 'effects-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'web sample';

  constructor(
    private actions$: Actions
  ) {
    this.actions$.dispatch(testActionTwo({ yes: 'test test' }));
  }
}
