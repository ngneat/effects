import { BehaviorSubject } from 'rxjs';

const todos = new BehaviorSubject<Todo[]>([]);

export const todos$ = todos.asObservable();

export interface Todo {
  id: number;
  title: string;
}

export function prependTodo(todo: Todo) {
  todos.next([todo, ...todos.getValue()]);
}

export function setTodos(data: Todo[]) {
  todos.next(data);
}
