import { Subject } from 'rxjs';
import { Action } from './actions.types';

export class Actions extends Subject<Action> {
  dispatch(value: Action): void {
    this.next(value);
  }
}

export const actions = new Actions();
export const dispatch = actions.dispatch.bind(actions);
export const actionsDispatcher = actions.asObservable();
