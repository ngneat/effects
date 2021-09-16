import { actions, actionsFactory } from '@ngneat/effects';

describe('Actions factory', () => {

  it('should create a factory with a create function', (done) => {
    const todoActions   = actionsFactory('Todo');
    const todoActionOne = todoActions.create('Action one');

    actions.subscribe(action => {
      expect(action.type).toBe('[Todo] Action one');
      done();
    });

    actions.dispatch(todoActionOne);
  });

});
