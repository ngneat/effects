import { Component, Injectable } from '@angular/core';
import { TestBed, flushMicrotasks, fakeAsync } from '@angular/core/testing';
import { Actions, createAction, createEffect } from '@ngneat/effects';
import { tap } from 'rxjs';
import { ofType } from 'ts-action-operators';
import { provideEffects } from './provide-effects';
import { provideEffectsManager } from './provide-effects-manager';
import { Routes, provideRouter, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

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

@Component({ template: '', standalone: true })
class MockComponent {}

@Component({ template: '' })
class TodoComponent {
  constructor(private actions: Actions) {
    this.actions.dispatch(loadTodos());
  }
}

describe('provideEffects', () => {
  beforeEach(() => {
    spy.mockReset();
  });

  it('should provide effects', () => {
    TestBed.configureTestingModule({
      providers: [
        provideEffectsManager(),
        provideEffects(EffectsOne, EffectsTwo, EffectsThree),
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
      ],
    });
    TestBed.inject(TodoComponent);

    expect(spy).toHaveBeenCalled();
  });

  it('should subscribe on the same effects only once', fakeAsync(() => {
    const routes: Routes = [
      {
        path: '',
        component: MockComponent,
        providers: [provideEffects(EffectsOne)],
      },
    ];

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        TodoComponent,
        provideRouter([
          {
            path: 'test',
            loadChildren: () => Promise.resolve().then(() => routes),
          },
        ]),
        provideEffectsManager(),
        provideEffects(EffectsOne, EffectsOne, EffectsOne),
      ],
    });
    TestBed.inject(Router).navigate(['/test']);

    flushMicrotasks();

    TestBed.inject(TodoComponent);

    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('should properly determine source instances and subscribe to their effects', () => {
    const sourceSpy = jest.fn();
    const action = createAction('Action');
    const effects = {
      one: class A {
        loadTodos$ = createEffect((actions) =>
          actions.pipe(ofType(action), tap(sourceSpy))
        );
      },
      two: class A {
        loadTodos$ = createEffect((actions) =>
          actions.pipe(ofType(action), tap(sourceSpy))
        );
      },
    };
    const extendedEffect = class A extends effects.one {};

    TestBed.configureTestingModule({
      providers: [
        provideEffectsManager(),
        provideEffects(effects.one, effects.two, extendedEffect),
      ],
    });

    expect(TestBed.inject(effects.one)).toBeDefined();
    expect(TestBed.inject(effects.two)).toBeDefined();
    expect(TestBed.inject(extendedEffect)).toBeDefined();

    TestBed.inject(Actions).dispatch(action());

    expect(sourceSpy).toHaveBeenCalledTimes(3);
  });

  it("should thrown an error if effects manager wasn't provided at the root level", () => {
    TestBed.configureTestingModule({
      providers: [provideEffects(EffectsOne)],
    });

    expect(() => TestBed.inject(EffectsOne)).toThrowError();
  });
});
