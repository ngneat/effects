import { actions, createAction, toPayload } from '../index';
import { props }                            from 'ts-action';
import { ofType }                           from 'ts-action-operators';

const action = createAction('Action Two', props<{ value: string }>());

describe('To payload operator', () => {

  it('should extract the payload', (done) => {
    actions.pipe(
      ofType(action),
      toPayload()
    ).subscribe(payload => {
      expect(payload).toStrictEqual({ value: 'test' });
      done();
    });

    actions.dispatch(action({ value: 'test' }));
  });

});
