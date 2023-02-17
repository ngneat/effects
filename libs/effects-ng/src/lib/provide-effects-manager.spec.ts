import { Component, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createAction, createEffect } from '@ngneat/effects';
import { tap, map } from 'rxjs';
import { ofType } from 'ts-action-operators';
import { Actions } from './actions';
import { provideEffects } from './provide-effects';
import { provideEffectsManager } from './provide-effects-manager';

const spy = jest.fn();

const loadTodos = createAction('[Todos] Load Todos');
const loadTodos2 = createAction('[Todos] Load Todos 2');

class CustomActions extends Actions {}

@Injectable()
class EffectsOne {
  loadTodos$ = createEffect((actions) =>
    actions.pipe(ofType(loadTodos), tap(spy))
  );
}

@Injectable()
class EffectsTwo {
  loadTodos$ = createEffect((actions) =>
    actions.pipe(
      ofType(loadTodos2),
      map(() => loadTodos())
    )
  );
}

@Component({ template: '' })
class TodoComponent {
  constructor(private actions: Actions) {
    this.actions.dispatch(loadTodos2());
  }
}

describe('provideEffectsManager', () => {
  it('should dispatch an action by default on effect emit', () => {
    TestBed.configureTestingModule({
      providers: [
        TodoComponent,
        provideEffects(EffectsOne, EffectsTwo),
        provideEffectsManager({ dispatchByDefault: true }),
      ],
    });
    TestBed.inject(TodoComponent);

    expect(spy).toHaveBeenCalled();
  });

  it('should use a custom action stream', () => {
    const customActionsStream = new CustomActions();
    const dispatchSpy = jest.spyOn(customActionsStream, 'dispatch');

    TestBed.configureTestingModule({
      providers: [
        TodoComponent,
        provideEffects(EffectsOne),
        provideEffectsManager({ customActionsStream }),
      ],
    });

    const component = TestBed.inject(TodoComponent);

    expect((component as any).actions).toBeInstanceOf(CustomActions);
    expect(dispatchSpy).toHaveBeenCalled();
  });
});
