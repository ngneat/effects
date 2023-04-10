import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngneat/effects-ng';
import { addTodo, loadTodos } from './+state/actions';
import { todos$ } from './+state/todos.repository';
import { TodoEffects } from './+state/todo.effects';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'effects-todo',
  template: `
    <h1>Todos</h1>

    <div class="add-todo">
      <h3>Add todo</h3>
      <input type="text" #addTodo />
      <button (click)="onClickAddTodo(addTodo.value)">Add todo</button>
    </div>

    <div class="search-todo">
      <h3>Search todo</h3>
      <input type="text" #searchTodo />
      <button (click)="onClickSearchTodo(searchTodo.value)">Search todo</button>
    </div>

    <ul>
      <li *ngFor="let todo of todos | async">{{ todo.title }}</li>
    </ul>
  `,
  standalone: true,
  imports: [NgFor, AsyncPipe],
})
export class TodoComponent implements OnInit {
  addTodo = '';
  todos = todos$;

  constructor(private actions: Actions, private todoEffects: TodoEffects) {}

  ngOnInit() {
    this.actions.dispatch(loadTodos());
  }

  onClickAddTodo(value: string) {
    this.actions.dispatch(addTodo({ id: Math.random(), title: value }));
  }

  onClickSearchTodo(value: string) {
    this.todoEffects.searchTodo(value);
  }
}
