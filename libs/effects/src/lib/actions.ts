import { Subject } from 'rxjs';
import { Action }  from './action.model';

export class Actions extends Subject<Action> {
  dispatch(value: Action): void {
    this.next(value);
  }
}

export const actions           = new Actions();
export const actionsDispatcher = actions.asObservable();
