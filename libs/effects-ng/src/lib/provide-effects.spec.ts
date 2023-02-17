import { Component, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createAction, createEffect } from '@ngneat/effects';
import { tap } from 'rxjs';
import { ofType } from 'ts-action-operators';
import { Actions } from './actions';
import { provideEffects } from './provide-effects';
import { provideEffectsManager } from './provide-effects-manager';

const spy = jest.fn();

const loadTodos = createAction('[Todos] Load Todos');

@Injectable()
class EffectsOne {
  loadTodos$ = createEffect((actions) =>
    actions.pipe(ofType(loadTodos), tap(spy))
  );
}

@Injectable()
class EffectsTwo {}

@Injectable()
class EffectsThree {}

@Component({ template: '' })
class TodoComponent {
  constructor(private actions: Actions) {
    this.actions.dispatch(loadTodos());
  }
}

describe('provideEffects', () => {
  it('should provide effects', () => {
    TestBed.configureTestingModule({
      providers: [
        provideEffectsManager(),
        provideEffects(EffectsOne),
        provideEffects(EffectsTwo, EffectsThree),
      ],
    });

    const effectsOneInstance = TestBed.inject(EffectsOne);
    const effectsTwoInstance = TestBed.inject(EffectsTwo);
    const effectsThreeInstance = TestBed.inject(EffectsThree);

    expect(effectsOneInstance).toBeDefined();
    expect(effectsTwoInstance).toBeDefined();
    expect(effectsThreeInstance).toBeDefined();
  });

  it('should trigger effects on action dispatch', () => {
    TestBed.configureTestingModule({
      providers: [
        TodoComponent,
        provideEffectsManager(),
        provideEffects(EffectsOne),
        provideEffects(EffectsOne),
      ],
    });
    TestBed.inject(TodoComponent);

    expect(spy).toHaveBeenCalled();
  });

  it("should thrown an error if effects manager wasn't provided at the root level", () => {
    TestBed.configureTestingModule({
      providers: [provideEffects(EffectsOne)],
    });

    expect(() => TestBed.inject(EffectsOne)).toThrowError();
  });
});
