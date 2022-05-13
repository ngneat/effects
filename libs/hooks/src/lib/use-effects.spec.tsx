
import { createAction, createEffect, dispatch, initEffects, ofType } from '@ngneat/effects';
import { finalize, tap } from 'rxjs/operators';
import { render } from '@testing-library/react';
import { useEffects } from '..';
import { useEffect } from 'react';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;


describe('useEffects', () => {
  const spy = jest.fn();
  const destroySpy = jest.fn();

  initEffects();

  const loadTodos = createAction('[Todos] Load Todos');

  const loadTodos$ = createEffect((actions) =>
    actions.pipe(
      ofType(loadTodos),
      tap(spy),
      finalize(destroySpy)
    )
  );

  function SearchComponent() {
    useEffects(loadTodos$);

    useEffect(() => {
      dispatch(loadTodos())
    }, [])

    return <>Test</>
  }


  it('should register/unregister effects', () => {
    const { unmount } = render(<SearchComponent />);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ type: '[Todos] Load Todos' });

    unmount();

    expect(destroySpy).toHaveBeenCalledTimes(1);
  });
})