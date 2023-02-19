import { actions, createAction, toPayload } from '../index';
import { payload } from 'ts-action';
import { ofType } from 'ts-action-operators';

const action = createAction('Action', payload<{ value: string }>());
const actionTwo = createAction('Action Two');

describe('To payload operator', () => {
  it('should extract the payload', (done) => {
    actions.pipe(ofType(action), toPayload()).subscribe((payload) => {
      expect(payload).toStrictEqual({ value: 'test' });

      done();
    });

    actions.dispatch(action({ value: 'test' }));
  });

  it('should thrown typescript error', () => {
    /* eslint-disable */
    // @ts-expect-error
    actions.pipe(ofType(actionTwo), toPayload()).subscribe();
  });
});
