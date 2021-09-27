<p align="center">
 <img width="15%" height="15%" src="effects.png">
</p>

<br />

> A framework-agnostic RxJS effects implementation


[![@ngneat/effects](https://github.com/ngneat/effects/actions/workflows/ci.yml/badge.svg)](https://github.com/ngneat/effects/actions/workflows/ci.yml)
![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)
![coc-badge](https://img.shields.io/badge/codeof-conduct-ff69b4.svg?style=flat-square)
![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e5079.svg?style=flat-square]https://github.com/semantic-release/semantic-release)
![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square]https://github.com/prettier/prettier)

# Effects

First, we need to initialize the the library by calling the `initEffects()` function:

```ts
import { initEffects } from '@ngneat/effects';

initEffects();
```

Next, we need to define our actions. For example:

```ts
import { createAction } from '@ngneat/effects';

export const addTodo = createAction('[Todos] Add Todo', props < { title: string });
```

Next, we need to define the effects, and register them:

```ts
import { createEffect, registerEffects, ofType } from '@ngneat/effects';

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
import { dispatch }   from '@ngneat/effects';
import { useEffect }  from 'react';

export function TodosPage() {
  useEffects([loadTodos$, addTodo$]);

  useEffect(() => dispatch(loadTodos()), []);

  return (
    <button onClick = {()
=>
  dispatch(addTodo({ title: 'foo' }))
}>
  Add
  < /button>
)
}
```

The effects we pass are tied to the component life cycle hook and will be destroyed with the component.

## Use with Angular

First, install the package: `npm i @ngneat/effects-ng`.

Then we need to register our root effects in our app module.

```ts
import { TodoEffects } from "todo/todo.effect.ts"

// app.module.ts
EffectsNgModule.forRoot([TodoEffects])

@NgModule({
  imports: [
    EffectsNgModule.forRoot([TodoEffects]),
  ]
})
export class AppModule {
}
```

In order to register lazily loaded effects use the forFeature method.

```ts
import { UserEffects } from "user/user.effect.ts"

// lazy.module.ts
@NgModule({
  imports: [
    EffectsNgModule.forFeature([UserEffects])
  ]
})
export class LazyModule {
}
```

An injectable effects class holds properties and uses dependency injection as you're familiar from other Angular
injectable services.

```ts
// todo.effect.ts
@Injectable()
export class TodoEffects {

  constructor(
    private todoApiService: TodoApiService
  ) {
  }

  loadTodos = createEffect(actions => actions.pipe(
    ofType(loadTodos),
    switchMap((todo) => this.todoApiService.loadTodos()),
    map(({ todos }) => actions.dispatch(showSnackbar({ message: `Todos loaded.` })))
  ));
}
```

Effects listen to actions that can be triggered by using the actions stream and its dispatch method

```ts
// todo.action.ts
export interface Todo {
  id: string;
  name: string;
  status: "not started" | "in progress" | "done"
}

// we recommend using the actions factory to prefix each action for better readability and debug purposes when using redux dev tools
const todoActions = actionsFactory("todo")

// we can declare an action by passing it a type and an optional payload. 
export const loadTodos = todoActions.create("Load Todos")
export const addTodo   = todoActions.create("Add Todo", props<Todo>())

```

If we don't need the reactive behavior of effects and we want to call an effect without using actions we can use the
effect functions as explained [below](#angular-effect-functions).

The actions can be dispatched wherever we have access to the actions stream. Common use cases are dispatching actions in
components or within other effects

```ts
// app.component.ts
@Component(...)
export class AppComponent {
  constructor(private actions: Actions) {
  }

  ngOnInit() {
    this.actions.dispatch(loadTodos());
  }
}
```

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

The `createEffectFn` function takes a `callback` function which is passed an `Observable` parameter and returns
an `Observable`.

### Use with React

First, install the package: `npm i @ngneat/effects-hook`.

We can register the effect in our component, and call it when we need:

```ts
import { useComponentEffects$ } from '@ngneat/effects-hooks';

function SearchComponent() {
  const searchTodo = useComponentEffects(searchTodoEffect);

  return <input onChange = {({ target: { value } })
=>
  searchTodo(value)
}
  />
}
```

Every time the `effect` is called, its value is pushed into that `Observable`.

We can also register multiple effects:

```ts
function FooComponent() {
  const [addTodo, updateTodo, deleteTodo] = useComponentEffects([
    addTodoEffect, updateTodoEffect, deleteTodoEffect
  ]);

  return
...
}
```

<h3 id="angular-effect-functions">Use with Angular</h3>

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

<div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
