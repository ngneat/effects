import { actions, createAction } from '@ngneat/effects';

const actionOne = createAction('Action One');

describe('Actions', () => {

  it('should next an action', () => {
    const spy = jest.spyOn(actions, 'next');
    actions.dispatch(actionOne);

    expect(spy).toHaveBeenCalled();
  });

});
