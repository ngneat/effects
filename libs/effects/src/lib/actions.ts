import { Subject } from 'rxjs';
import { Action } from './action.model';

export class Actions extends Subject<Action> {
  dispatch(value: Action): void {
    this.logAction(value);

    this.next(value);
  }

  logAction(value: Action): void {
    const { type, ...props } = value;
    const hasPayload = Object.getOwnPropertyNames(props).length > 0;
    // logAction(type, null, hasPayload ? props : null);
  }
}

export const actions = new Actions();
