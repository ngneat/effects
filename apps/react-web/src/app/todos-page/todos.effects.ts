import { createAction, createEffect, ofType, props } from '@ngneat/effects';
import { delay, mergeMap, tap } from 'rxjs/operators';
import { prependTodo, setTodos, Todo, updateLoading } from './todos.repository';

export const loadTodos = createAction('[Todos] Load Todos');
export const addTodo = createAction('[Todos] Add Todo', props<Todo>());

export const loadTodos$ = createEffect((actions) =>
  actions.pipe(
    ofType(loadTodos),
    mergeMap(() => {
      return fetch('https://jsonplaceholder.typicode.com/todos').then((res) =>
        res.json()
      );
    }),
    tap((todos) => {
      updateLoading(false);
      setTodos(todos);
    })
  )
);

export const addTodo$ = createEffect((actions) =>
  actions.pipe(
    ofType(addTodo),
    delay(300),
    tap((props) => prependTodo(props))
  )
);
