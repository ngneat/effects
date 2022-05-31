import { actionsFactory, props } from '@ngneat/effects';
import { Todo } from './todos.repository';

const todoActions = actionsFactory('Todo');

export const loadTodos = todoActions.create('Load Todos');
export const addTodo = todoActions.create('Add Todo', props<Todo>());
