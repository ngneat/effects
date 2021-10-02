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

👉  Play with the code on [stackblitz](https://stackblitz.com/edit/react-ts-phemyx?devtoolsheight=50&file=index.tsx)

# Effects

First, we need to initialize the the library by calling the `initEffects()` function:

```ts
import { initEffects } from '@ngneat/effects';

initEffects();
```

Actions are created by using the `createAction` or `actionsFactory` functions:

```ts
import { actionsFactory, createAction, props } from '@ngneat/effects';

// todos.actions.ts
export interface Todo {
  id: string;
  name: string;
}

export const addTodo = createAction('[Todos] Add Todo', props<{ title: string });

// Ee recommend using the actions factory to prefix each action 
// for better readability and debug purposes when using redux dev tools
export const todoActions = actionsFactory('todo');

// We can declare an action by passing it a type and an optional payload. 
export const loadTodos = todoActions.create('Load Todos')
export const addTodo   = todoActions.create('Add Todo', props<Todo>())
```

Next, we need to define the `effects`, and register them:

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
    <button onClick = {() => dispatch(addTodo({ title: 'foo' }))}>
      Add
    </button>
  )
}
```

The effects we pass are tied to the component life cycle hook and will be destroyed with the component.

## Use with Angular

First, install the package: `npm i @ngneat/effects-ng`.

Next, create the `effect` provider:

```ts
import { createEffect }  from '@ngneat/effects';

@Injectable({ providedIn: 'root' })
export class TodosEffects {

  constructor(private todosApi: TodosApi) {}

  loadTodos$ = createEffect(actions => actions.pipe(
    ofType(loadTodos),
    switchMap((todo) => this.todosApi.loadTodos())
  ), /*{ dispatch: false }*/);
}
```

We can configure the effect to expect an action to be returned that will be dispatched by the effect. The default is set
to false.

Then we need to register our the `effects` in our app module:

```ts
import { EffectsNgModule } from '@ngneat/effects-ng';
import { TodosEffects }    from 'todos/todos.effect.ts';

@NgModule({
  imports: [
    EffectsNgModule.forRoot([TodosEffects], { dispatchByDefault: false }),
  ]
})
export class AppModule {
}
```

We can set the global config as a second parameter in the for root method. If we want each effect to expect an action to
be returned that can be dispatched we can set the dispatchByDefault property to true. The default is set to false. This
behavior can be overwritten on each effect as stated above.

In order to register lazily loaded effects use the `forFeature` method:

```ts
import { EffectsNgModule } from '@ngneat/effects-ng';
import { PostsEffects }    from "posts/posts.effect.ts"

@NgModule({
  imports: [
    EffectsNgModule.forFeature([PostsEffects])
  ]
})
export class LazyModule {
}
```

The actions can be dispatched by injecting the `Actions` provider:

```ts
import { Actions } from '@ngneat/effects-ng';

@Component(...)
export class AppComponent {
  constructor(private actions: Actions) {}

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
import { useEffectFn } from '@ngneat/effects-hooks';

function SearchComponent() {
  const searchTodo = useEffectFn(searchTodoEffect);

  return <input onChange = {({ target: { value } }) => searchTodo(value) }/>
}
```

Every time the `effect` is called, its value is pushed into that `Observable`.

We can also register multiple effects:

```ts
function FooComponent() {
  const [addTodo, updateTodo, deleteTodo] = useEffectFn([
    addTodoEffect, updateTodoEffect, deleteTodoEffect
  ]);

  return ...
}
```

<h3 id="angular-effect-functions">Use with Angular</h3>

First, install the package: `npm i @ngneat/effects-ng`.

Create an effect class, extends the `EffectFn` class and use the `createEffectFn` method to create your effects:

```ts
import { EffectFn } from '@ngneat/effects-ng';

export class TodosEffects extends EffectFn {

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
