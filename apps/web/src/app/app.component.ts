import { map, tap }                                                                                                           from 'rxjs';
import { Component }                                                                                                          from '@angular/core';
import { actions, actionsFactory, createAction, createEffect, initEffects, ofType, props, registerEffects, removeAllEffects } from '@ngneat/effects';

@Component({
  selector: 'effects-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'web sample';

  constructor() {
    initEffects();

    const todoActions = actionsFactory('todo');

    const todoActionOne = todoActions.create('One');
    const todoActionTwo = todoActions.create('Two', props<{ test: string }>());

    const welcomeAction        = createAction('Welcome');
    const welcomeActionSuccess = createAction(
      'Welcome Success',
      props<{ test: string }>()
    );

    const welcomeEffect = createEffect(
      (actions) =>
        actions.pipe(
          ofType(welcomeAction),
          tap((_) => console.log('Yes')),
          map((_) => welcomeActionSuccess({ test: 'Yes yes' }))
        ),
      { dispatch: true }
    );

    const welcomeEffectSuccess = createEffect((actions) =>
      actions.pipe(
        ofType(welcomeActionSuccess),
        tap((props) => console.log('Success', props))
      )
    );

    const todoEffectOne = createEffect(actions =>
      actions.pipe(
        ofType(todoActionOne),
        tap(action => console.log('todo action on works -', action.type))
      )
    );

    registerEffects([welcomeEffect]);
    registerEffects([welcomeEffectSuccess]);
    registerEffects([todoEffectOne]);

    actions.dispatch(welcomeAction());

    // removeEffects([welcomeEffect])

    actions.dispatch(welcomeAction());

    actions.dispatch(todoActionOne);

    removeAllEffects();

    actions.dispatch(welcomeAction());

  }
}
