import { Component, Injectable, NgModule } from '@angular/core';
import { TestBed, flushMicrotasks, fakeAsync } from '@angular/core/testing';
import { createAction, createEffect } from '@ngneat/effects';
import { tap } from 'rxjs';
import { ofType } from 'ts-action-operators';
import { Actions } from './actions';
import { EffectsNgModule } from './effects-ng.module';
import { EFFECTS_PROVIDERS } from './tokens';
import { Router, RouterModule } from '@angular/router';

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

describe('Effects ng module', () => {
  beforeEach(() => {
    spy.mockReset();
  });

  it('should provide effects one using forRoot', () => {
    TestBed.configureTestingModule({
      imports: [EffectsNgModule.forRoot([EffectsOne])],
    });

    const effectsOneInstance = TestBed.inject(EffectsOne);
    expect(effectsOneInstance).toBeDefined();
  });

  it('should provide for feature effects', () => {
    TestBed.configureTestingModule({
      imports: [
        EffectsNgModule.forRoot([EffectsOne]),
        EffectsNgModule.forFeature([EffectsTwo, EffectsThree]),
      ],
    });

    const effectsProviders = TestBed.inject<any>(EFFECTS_PROVIDERS);

    expect(effectsProviders[0]).toEqual([EffectsOne]);
    expect(effectsProviders[1]).toEqual([EffectsTwo, EffectsThree]);
  });

  it('should trigger effects on action dispatch', () => {
    TestBed.configureTestingModule({
      providers: [TodoComponent],
      imports: [EffectsNgModule.forRoot([EffectsOne])],
    });
    TestBed.inject(TodoComponent);

    expect(spy).toHaveBeenCalled();
  });

  it('should subscribe on the same effects only once', fakeAsync(() => {
    @NgModule({
      imports: [
        RouterModule.forChild([
          {
            path: '',
            component: MockComponent,
          },
        ]),
        EffectsNgModule.forFeature([EffectsOne, EffectsOne]),
      ],
    })
    class LazyModule {}

    TestBed.configureTestingModule({
      providers: [TodoComponent],
      imports: [
        RouterModule.forRoot([
          {
            path: 'test',
            loadChildren: () => Promise.resolve().then(() => LazyModule),
          },
        ]),
        EffectsNgModule.forRoot([EffectsOne, EffectsOne]),
      ],
    });

    TestBed.inject(Router).navigate(['/test']);

    flushMicrotasks();

    TestBed.inject(TodoComponent);

    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('should use a custom action stream', (done) => {
    const customActionsStream = new Actions();

    TestBed.configureTestingModule({
      imports: [EffectsNgModule.forRoot([EffectsOne], { customActionsStream })],
    });

    customActionsStream.pipe(ofType(loadTodos)).subscribe((todos) => {
      expect(todos).toBeDefined();
      done();
    });
    customActionsStream.dispatch(loadTodos());
  });
});
