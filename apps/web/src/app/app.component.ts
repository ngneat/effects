import {Component} from '@angular/core';
import {actions$, createAction, createEffect, initEffects, registerEffects} from "@effects/effects";
import {ofType} from "ts-action-operators";
import {map, tap} from "rxjs";
import {props} from "ts-action";

@Component({
  selector: 'effects-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'web sample';

  constructor() {
    initEffects()

    const welcomeAction = createAction("Welcome")
    const welcomeActionSuccess = createAction(
      "Welcome Success",
      props<{ test: string }>()
    )

    const welcomeEffect = createEffect((actions => actions.pipe(
      ofType(welcomeAction),
      tap(_ => console.log("Yes")),
      map(_ => welcomeActionSuccess({test: "Yes yes"}))
    )), {dispatch: true})

    const welcomeEffectSuccess = createEffect((actions => actions.pipe(
      ofType(welcomeActionSuccess),
      tap(props => console.log("Success", props)),
    )))

    registerEffects([welcomeEffect])
    registerEffects([welcomeEffectSuccess])


    actions$.dispatch(welcomeAction())

    // removeEffects([welcomeEffect])

    actions$.dispatch(welcomeAction())

    // removeAllEffects()

    actions$.dispatch(welcomeAction())
  }

}