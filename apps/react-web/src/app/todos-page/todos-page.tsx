import { useEffect, useState } from 'react';
import { addTodo, addTodo$, loadTodos, loadTodos$, searchTodoEffect } from './todos.effects';
import { loading$, todos$ } from './todos.repository';
import { dispatch } from '@ngneat/effects';
import { useEffectFn, useEffects } from '@ngneat/effect-hooks';
import { useObservable } from '@ngneat/use-observable';

function SearchComponent() {
  const searchTodo = useEffectFn(searchTodoEffect);

  return <input onChange={({ target: { value } }) => searchTodo(value)} />
}

export function TodosPage() {
  useEffects([loadTodos$, addTodo$]);

  const [show, setShow] = useState(true);
  const [todos] = useObservable(todos$);
  const [loading] = useObservable(loading$);

  useEffect(() => dispatch(loadTodos()), []);

  return (
    <div>
      <h1>Welcome to TodosPage!</h1>

      <button onClick={() => setShow(show => !show)}>Toggle</button>
      {show && <SearchComponent />}

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
