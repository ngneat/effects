import { map } from 'rxjs';
import { ofType } from 'ts-action-operators';
import { createEffect } from './create-effect';
import { createAction } from '../index';

const actionOne = createAction('Action One');
const actionTwo = createAction('Action Two');
const actionThree = createAction('Action Three');

describe('createEffect', () => {
  it('should throw type error when not actions are returned and dispatch is set to true', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    createEffect(
      (actions) =>
        actions.pipe(
          ofType(actionOne),
          map(() => actionTwo)
        ),
      { dispatch: true }
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    createEffect(
      (actions) =>
        actions.pipe(
          ofType(actionOne),
          map(() => [actionTwo(), actionOne, actionThree()])
        ),
      { dispatch: true }
    );

    const condition = true;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    createEffect(
      (actions) =>
        actions.pipe(
          ofType(actionOne),
          map(() => (condition ? [actionTwo()] : actionThree))
        ),
      { dispatch: true }
    );
  });
});
