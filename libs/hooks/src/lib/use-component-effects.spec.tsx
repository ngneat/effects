import { createEffectFn } from '@ngneat/effects';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { useComponentEffects } from './use-component-effects';
import { render, fireEvent } from '@testing-library/react';

describe('useComponentEffects', () => {
  const spy = jest.fn();
  const destroySpy = jest.fn();

  const searchTodoEffect = createEffectFn((searchTerm$: Observable<string>) => {
    return searchTerm$.pipe(
      finalize(destroySpy),
      tap(spy)
    );
  });

  function SearchComponent() {
    const searchTodo = useComponentEffects(searchTodoEffect);

    return <input data-testid="input" onChange={({ target: { value } }) => searchTodo(value)} />
  }


  it('should register/unregister effect function', () => {
    const { getByTestId, unmount } = render(<SearchComponent />);

    fireEvent.change(getByTestId('input'), { target: { value: 'foo' } });

    expect(spy).toHaveBeenCalledWith('foo');
    expect(spy).toHaveBeenCalledTimes(1);

    fireEvent.change(getByTestId('input'), { target: { value: 'bar' } });

    expect(spy).toHaveBeenCalledWith('bar');
    expect(spy).toHaveBeenCalledTimes(2);

    unmount();

    expect(destroySpy).toHaveBeenCalledTimes(1);

  })
})