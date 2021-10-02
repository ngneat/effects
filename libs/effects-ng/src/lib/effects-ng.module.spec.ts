import { Component, Injectable }      from '@angular/core';
import { TestBed }                    from '@angular/core/testing';
import { EffectsNgModule }            from './effects-ng.module';
import { ofType }                     from 'ts-action-operators';
import { tap }                        from 'rxjs';
import { Actions }                    from './actions';
import { createAction, createEffect } from '@ngneat/effects';
import { EFFECTS_PROVIDERS }          from './tokens';

const spy = jest.fn();

const loadTodos = createAction('[Todos] Load Todos');

@Injectable()
class EffectsOne {
  loadTodos$ = createEffect((actions) => actions.pipe(
    ofType(loadTodos),
    tap(spy)
  ));
}

@Injectable()
class EffectsTwo {
}

@Injectable()
class EffectsThree {
}

@Component({ template: '' })
class TodoComponent {
  constructor(
    private actions: Actions
  ) {
    this.actions.dispatch(loadTodos());
  }
}

describe('Effects ng module', () => {

  it('should provide effects one using forRoot', () => {
    TestBed.configureTestingModule({
      imports: [EffectsNgModule.forRoot([EffectsOne])]
    });

    const effectsOneInstance = TestBed.inject(EffectsOne);
    expect(effectsOneInstance).toBeDefined();
  });

  it('should provide for feature effects', () => {
    TestBed.configureTestingModule({
      imports: [
        EffectsNgModule.forRoot([EffectsOne]),
        EffectsNgModule.forFeature([EffectsTwo, EffectsThree])
      ]
    });

    const effectsProviders = TestBed.inject<any>(EFFECTS_PROVIDERS);

    expect(effectsProviders[0]).toEqual([EffectsOne]);
    expect(effectsProviders[1]).toEqual([EffectsTwo, EffectsThree]);
  });

  it('should trigger effects on action dispatch', () => {
    TestBed.configureTestingModule({
      providers: [TodoComponent],
      imports: [
        EffectsNgModule.forRoot([EffectsOne])
      ]
    });
    TestBed.inject(TodoComponent);

    expect(spy).toHaveBeenCalled();
  });

});
