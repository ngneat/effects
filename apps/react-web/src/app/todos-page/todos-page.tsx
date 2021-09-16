import { useEffect } from 'react';
import { addTodo, addTodo$, loadTodos, loadTodos$ } from './todos.effects';
import { loading$, todos$ } from './todos.repository';
import { dispatch } from '@ngneat/effects';
import { useEffects } from '@ngneat/effect-hooks';
import { useObservable } from '@ngneat/use-observable';

export function TodosPage() {
  useEffects([loadTodos$, addTodo$]);

  const [todos] = useObservable(todos$);
  const [loading] = useObservable(loading$);

  useEffect(() => dispatch(loadTodos()), []);

  return (
    <div>
      <h1>Welcome to TodosPage!</h1>

      <button
        onClick={() =>
          dispatch(
            addTodo({ id: Math.random(), title: Math.random().toString() })
          )
        }
      >
        Add
      </button>

      {loading && 'Loading...'}

      {!loading &&
        todos.map((todo) => {
          return <p key={todo.id}>{todo.title}</p>;
        })}
    </div>
  );
}
