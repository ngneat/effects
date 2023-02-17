import { actions, createAction } from '../index';

const actionOne = createAction('Action One');
const actionTwo = createAction('Action Two');
const actionThree = createAction('Action Three');

describe('Actions', () => {
  it('should next actions', () => {
    const spy = jest.spyOn(actions, 'next');
    actions.dispatch(actionOne());

    expect(spy).toHaveBeenCalledTimes(1);

    actions.dispatch(actionTwo(), actionThree());

    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should throw typescript error', () => {
    /* eslint-disable */
    // @ts-expect-error
    actions.dispatch(actionOne);
    // @ts-expect-error
    actions.dispatch(actionOne(), actionOne);
    // @ts-expect-error
    actions.dispatch(actionTwo(), actionThree);

    const strongTypedArrayWithActionCreator = [
      actionOne(),
      actionTwo,
      actionThree(),
    ] as const;

    // @ts-expect-error
    actions.dispatch(...strongTypedArrayWithActionCreator);

    const arrayWithActionCreator = [actionOne(), actionTwo, actionThree()];

    // @ts-expect-error
    actions.dispatch(...arrayWithActionCreator);
  });
});
