import { actions, actionsFactory } from '../index';

describe('Actions factory', () => {
  it('should create a factory with a create function', () => {
    const todoActions = actionsFactory('Todo');
    const todoActionOne = todoActions.create('Action one');

    actions.subscribe((action) => {
      expect(action.type).toBe('[Todo] Action one');
    });

    actions.dispatch(todoActionOne);
  });
});
