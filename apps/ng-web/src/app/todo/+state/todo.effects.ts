import { Injectable } from '@angular/core';
import { createEffect } from '@ngneat/effects';
import { ofType } from 'ts-action-operators';
import { debounceTime, delay, mergeMap, tap } from 'rxjs/operators';
import { prependTodo, setTodos, Todo } from './todos.repository';
import { addTodo, loadTodos } from './actions';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EffectFn } from '@ngneat/effects-ng';

@Injectable({ providedIn: 'root' })
export class TodoEffects extends EffectFn {
  constructor(private httpClient: HttpClient) {
    super();
  }

  loadTodos$ = createEffect((actions) =>
    actions.pipe(
      ofType(loadTodos),
      mergeMap(() => {
        return this.httpClient.get<Todo[]>(
          'https://jsonplaceholder.typicode.com/todos?_limit=10'
        );
      }),
      tap(setTodos)
    )
  );

  addTodo$ = createEffect((actions) =>
    actions.pipe(
      ofType(addTodo),
      delay(300),
      tap((props) => prependTodo(props))
    )
  );

  searchTodo = this.createEffectFn((searchTerm$: Observable<string>) => {
    return searchTerm$.pipe(debounceTime(300), tap(console.log));
  });
}
