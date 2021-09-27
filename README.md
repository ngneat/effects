> A framework-agnostic RxJS effects implementation


# Effects


## Use with Angular

## Use with React


# Effects Functions
To use an `effect` function we first need to create it by using the `createEffectFn` function:

```ts
import { createEffect } from '@ngneat/effects';

export const searchTodoEffect = createEffect((searchTerm$: Observable<string>) => {
  return searchTerm$.pipe(
    debounceTime(300),
    switchMap((searchTerm) => fetchTodos({ searchTerm })),
  );
});
```

The `createEffectFn` function takes a `callback` function which is passed an `Observable` parameter and returns an `Observable`.

### Use with React
We can register the effect in our component, and call it when we need:

```ts
import { useComponentEffects$ } from '@ngneat/effects';

function SearchComponent() {
  const searchTodo = useComponentEffects(searchTodoEffect);

  return <input onChange={({ target: { value } }) => searchTodo(value)} />
}
```

Every time the `effect` is called, its value is pushed into that `Observable`.


We can also register multiple effects:

```ts
function FooComponent() {
  const [addTodo, updateTodo, deleteTodo] = useComponentEffects([
    addTodoEffect, updateTodoEffect, deleteTodoEffect
  ]);

  return ...
}
```

### Use with Angular
Create an effect class, extends the `ComponentEffects` and use the `createEffectFn` to create your effects:

```ts
import { ComponentEffects } from '@ngneat/effects';

export class TodosEffects extends ComponentEffects {

  searchTodo = this.createEffectFn((searchTerm$: Observable<string>) => {
    return searchTerm$.pipe(
      debounceTime(300),
      switchMap((searchTerm) => fetchTodos({ searchTerm })),
    );
 }); 
}
```

Inject the effects provider in your component, and call it when you need:

```ts
@Component({
  providers: [TodosEffects],
})
export class TodosComponent {
  constructor(private todosEffects: TodosEffects) {
  }

  ngOnInit() {
    this.control.valueChanges.subscribe(searchTerm => {
      this.todosEffects.searchTodo(searchTerm);
    });
  }
}
```
