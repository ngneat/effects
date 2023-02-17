import { Action } from './actions.types';
import { ActionCreator } from 'ts-action/action';

export type ErrorMessage =
  'Functions are not allowed to be dispatched. Did you forget to call the action creator function?';

export type ActionCreatorIsNotAllowed<T extends Action> =
  T extends ActionCreator ? ErrorMessage : T;

export type ActionCreatorsAreNotAllowed<T extends Action[]> = T extends [
  infer First,
  ...infer R
]
  ? First extends Action
    ? ActionCreatorIsNotAllowed<First> extends ErrorMessage
      ? R extends Action[]
        ? [ErrorMessage, ...ActionCreatorsAreNotAllowed<R>]
        : never
      : R extends Action[]
      ? [First, ...ActionCreatorsAreNotAllowed<R>]
      : never
    : never
  : T[0] extends ActionCreatorIsNotAllowed<T[0]>
  ? T
  : [];
