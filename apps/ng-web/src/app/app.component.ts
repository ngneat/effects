import { Component, OnInit } from '@angular/core';
import { testActionTwo }     from './state/test.actions';
import { Actions }           from '@ngneat/effects-ng';
import { Foo }               from './eager/state/foo-effects';

@Component({
  selector: 'effects-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Foo]
})
export class AppComponent implements OnInit {
  constructor(
    private foo: Foo,
    private actions: Actions
  ) {
    this.actions.dispatch(testActionTwo({ yes: 'test test' }));
  }

  ngOnInit() {
    this.foo.addTodo('foo');
  }
}
