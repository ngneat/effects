import { Actions } from './actions';
import { Observable } from 'rxjs';
import { Effect, EffectConfig } from './effects.types';
import { Action } from './actions.types';
import {
  ActionCreatorIsNotAllowed,
  ActionCreatorsAreNotAllowed,
} from './action-creator-is-not-allowed.type';

/**
 * @usageNotes
 *
 * ### Without provided `dispatch` or with `dispatch` set to `false`.
 *
 * You can return anything in passed observable.
 *
 * ```ts
 * const anything: any;
 *
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    map(() => anything)
 *  )
 * );
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    map(() => anything)
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
 *
 * const action = createAction('Get todos');
 * const action2 = createAction('Update todo');
 *
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    map(() => action())
 *  )
 * );
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    map(() => [action(), action2()])
 *  )
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
 * You can return an `Action` to be dispatched.
 *
 * ```ts
 * const action = createAction('Get todos');
 *
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    map(() => action())
 *  ),
 *  { dispatch: true }
 * );
 * ```
 */
export function createEffect<T extends Action>(
  factory: (actions: Actions) => Observable<ActionCreatorIsNotAllowed<T>>,
  config: { dispatch: true }
): Effect<ActionCreatorIsNotAllowed<T>>;
/**
 * @usageNotes
 *
 * ### With `dispatch` set to `true`.
 *
 * You can return an array of `Action`s to be dispatched.
 *
 * ```ts
 * const action = createAction('Get todos');
 * const action2 = createAction('Update todo');
 *
 * const effect$ = createEffect(
 *  (actions) => actions.pipe(
 *    map(() => [action(), action2()])
 *  ),
 *  { dispatch: true }
 * );
 * ```
 */
export function createEffect<T extends Action>(
  factory: (actions: Actions) => Observable<ActionCreatorIsNotAllowed<T>[]>,
  config: { dispatch: true }
): Effect<ActionCreatorIsNotAllowed<T>[]>;
export function createEffect<T extends Action>(
  factory: (
    actions: Actions
  ) => Observable<
    ActionCreatorIsNotAllowed<T> | ActionCreatorsAreNotAllowed<T[]> | any
  >,
  config?: EffectConfig
): Effect {
  return { sourceFn: factory, config };
}
