import { Actions } from './actions';
import { Observable } from 'rxjs';
import { Effect, EffectConfig } from './effects.types';
import { Action } from './actions.types';
import { ActionCreatorOrActionCreatorsAreNotAllowed } from './action-creator-is-not-allowed.type';

/**
 * @usageNotes
 *
 * ### Without provided `dispatch` or with `dispatch` set to `false`.
 *
 * You can return anything in passed observable.
 *
 * ```ts
 * const trigger = createAction('Trigger');
 *
 * const anything: any;
 *
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    ofType(trigger),
 *    map(() => anything)
 *  )
 * );
 *
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    ofType(trigger)
 *  )
 * );
 *
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    ofType(trigger),
 *    map(() => anything)
 *  ),
 *  { dispatch: false }
 * );
 *
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    ofType(trigger)
 *  ),
 *  { dispatch: false }
 * );
 *
 * ```
 *
 * Be aware that if you set `dispatchByDefault` to `true` for your `EffectsManager` and do not explicitly pass
 *   `dispatch` in the `createAction` then passed observable has to return either `Action` or an array of `Action`s
 *   otherwise you'll get an error.
 *
 * ```ts
 * { dispatchByDefault: true }
 *
 * ...
 * const trigger = createAction('Trigger');
 *
 * const action = createAction('Get todos');
 * const action2 = createAction('Update todo');
 *
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    ofType(trigger),
 *    map(() => action())
 *  )
 * );
 *
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    ofType(trigger),
 *    map(() => [action(), action2()])
 *  )
 * );
 *
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    ofType(trigger),
 *    map(() => condition ? [action(), action2()] : action())
 *  ),
 *  { dispatch: true }
 * );
 * ```
 */
export function createEffect<T>(
  factory: (actions: Actions) => Observable<T>,
  config?: { dispatch: false }
): Effect<T>;
/**
 * @usageNotes
 *
 * ### With `dispatch` set to `true`.
 *
 * You can return an `Action` or an array of `Action`s to be dispatched.
 *
 * ```ts
 * const trigger = createAction('Trigger');
 *
 * const action = createAction('Get todos');
 * const action2 = createAction('Update todo');
 *
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    ofType(trigger),
 *    map(() => action())
 *  ),
 *  { dispatch: true }
 * );
 *
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    ofType(trigger),
 *    map(() => [action(), action2()])
 *  ),
 *  { dispatch: true }
 * );
 *
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    ofType(trigger),
 *    map(() => condition ? [action(), action2()] : action())
 *  ),
 *  { dispatch: true }
 * );
 * ```
 */
export function createEffect<T extends Action | Action[]>(
  factory: (
    actions: Actions
  ) => Observable<ActionCreatorOrActionCreatorsAreNotAllowed<T>>,
  config: { dispatch: true }
): Effect<ActionCreatorOrActionCreatorsAreNotAllowed<T>>;
export function createEffect(
  factory: (
    actions: Actions
  ) => Observable<
    ActionCreatorOrActionCreatorsAreNotAllowed<Action | Action[]> | any
  >,
  config?: EffectConfig
): Effect {
  return { sourceFn: factory, config };
}
