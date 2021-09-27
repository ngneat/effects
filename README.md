> A framework-agnostic RxJS effects implementation

# Effects

First, we need to initialize the the library by calling the `initEffects()` function:

```ts
import { initEffects } from '@ngneat/effects';

initEffects();
```

Next, we need to define our actions. For example:

```ts
import { createAction } from '@ngneat/effects';

export const addTodo = createAction('[Todos] Add Todo', props<{ title: string });
```

Next, we need to define the effects, and register them:

```ts
import { createEffect, registerEffects } from '@ngneat/effects';

export const addTodo$ = createEffect((actions) =>
  actions.pipe(
    ofType(addTodo),
    tap(console.log)
  )
);

registerEffects([addTodo$])
```

Finally, we can dispatch actions using the `dispatch` function:

```ts
import { dispatch } from '@ngneat/effects';

dispatch(addTodo({ title: 'effects' }));
```

## Use with React
First, install the package: `npm i @ngneat/effects-hook`.

Now, we can use the `useEffects` hook and pass our effects:

```ts
import { useEffects } from '@ngneat/effects-hook';
import { dispatch } from '@ngneat/effects';
import { useEffect } from 'react';

export function TodosPage() {
  useEffects([loadTodos$, addTodo$]);

  useEffect(() => dispatch(loadTodos()), []);

  return (
    <button onClick={() => dispatch(addTodo({ title: 'foo' }))}>
       Add
    </button>
  )
}
```

The effects we pass are tied to the component life cycle hook and will be destroyed with the component.

## Use with Angular
First, install the package: `npm i @ngneat/effects-ng`.



# Effect Functions
To use an `effect` function we first need to create it by using the `createEffectFn` function:

```ts
import { createEffectFn } from '@ngneat/effects';

export const searchTodoEffect = createEffectFn((searchTerm$: Observable<string>) => {
  return searchTerm$.pipe(
    debounceTime(300),
    switchMap((searchTerm) => fetchTodos({ searchTerm })),
  );
});
```

The `createEffectFn` function takes a `callback` function which is passed an `Observable` parameter and returns an `Observable`.

### Use with React
First, install the package: `npm i @ngneat/effects-hook`.

We can register the effect in our component, and call it when we need:

```ts
import { useComponentEffects$ } from '@ngneat/effects-hooks';

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
First, install the package: `npm i @ngneat/effects-ng`.

Create an effect class, extends the `ComponentEffects` and use the `createEffectFn` to create your effects:

```ts
import { ComponentEffects } from '@ngneat/effects-ng';

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
