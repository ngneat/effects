import { createAction, actions } from '../index';
import { props } from 'ts-action';
import { ofType } from 'ts-action-operators';
import { toProps } from './to-props.operator';

const action = createAction('Action', props<{ value: string }>());

describe('To props operator', () => {
  it('should exclude the type', (done) => {
    actions.pipe(ofType(action), toProps()).subscribe((props) => {
      expect(props).toStrictEqual({ value: 'test' });

      done();
    });

    actions.dispatch(action({ value: 'test' }));
  });
});
