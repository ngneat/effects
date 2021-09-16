import { BehaviorSubject } from 'rxjs';

const todos = new BehaviorSubject<Todo[]>([]);
const loading = new BehaviorSubject<boolean>(true);

export const todos$ = todos.asObservable();
export const loading$ = loading.asObservable();

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

export function updateLoading(l: boolean) {
  loading.next(l);
}
