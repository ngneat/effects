import { Subject } from 'rxjs';
import { Action } from './actions.types';
import { ActionCreatorsAreNotAllowed } from './action-creator-is-not-allowed.type';

export class Actions extends Subject<Action> {
  dispatch<T extends Action[]>(
    ...actions: ActionCreatorsAreNotAllowed<T>
  ): void {
    actions.forEach((action) => {
      this.next(action);
    });
  }
}

export const actions = new Actions();
export const dispatch = actions.dispatch.bind(actions);
export const actionsDispatcher = actions.asObservable();
