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

👉 Play with the code on [stackblitz](https://stackblitz.com/edit/react-ts-phemyx?devtoolsheight=50&file=index.tsx)

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

export const addTodo = createAction('[Todos] Add Todo', props<{ title: string }>());

// We recommend using the actions factory to prefix each action 
// for better readability and debug purposes when using redux dev tools
export const todoActions = actionsFactory('todo');

// We can declare an action by passing it a type and an optional payload. 
export const loadTodos = todoActions.create('Load Todos')
export const addTodo   = todoActions.create('Add Todo', props<Todo>())
```

Next, we need to define the `effects`, and register them:

```ts
import { createEffect, registerEffects, ofType, tapResult } from '@ngneat/effects';

export const addTodo$ = createEffect((actions) =>
    actions.pipe(
      ofType(addTodo),
      switchMap(() => apiCall().pipe(
        tapResult(console.log, console.error)
      ))
    );
  )
);

registerEffects([addTodo$])
```

The `tapResult` operator safely handles the result. It enforces that the effect would still be running in case of error. Finally, we can dispatch actions using the `dispatch` function:

```ts
import { dispatch } from '@ngneat/effects';

dispatch(addTodo({ title: 'effects' }));
```
`tapResult` also let us specify a custom error and completed handler. If no custom error handling is specified, a possible error will be printed to the console.

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
import { createEffect } from '@ngneat/effects';

@Injectable({ providedIn: 'root' })
export class TodosEffects {

  constructor(private todosApi: TodosApi) {}

  loadTodos$ = createEffect(actions => actions.pipe(
    ofType(loadTodos),
    switchMap((todo) => this.todosApi.loadTodos())
  ));
}
```

By default, the return value of an effect doesn't dispatch an action. You can get this behavior by passing the { dispatch: false } option as a second parameter.

Then we need to register `effects manager` by calling `provideEffectsManager` at the root level. Also to register effects at the root level we need to call `provideEffect` function:

```ts
import { provideEffectsManager, provideEffect } from '@ngneat/effects-ng';
import { TodosEffects } from 'todos/todos.effect.ts';

@NgModule({
  providers: [
    /**
     *  provideEffectsManager({ dispatchByDefault: true }),
     */
    provideEffectsManager(),
    provideEffect(TodosEffects),
  ]
})
export class AppModule {
}

-- OR --

bootstrapApplication(AppComponent, {
  providers: [
    /**
     *  provideEffectsManager({ dispatchByDefault: true }),
     */
    provideEffectsManager(),
    provideEffects(TodosEffects)
  ],
});
```
The `provideEffectsManager` function can take the global configuration. 
We can set the `dispatchByDefault` property to true for each effect to dispatch the resulting action. The default is set to false.

As stated above, this behavior can be overwritten on each effect.

In order to register lazily loaded effects use the `provideEffect` function on the [`envirenment`](https://angular.io/api/core/EnvironmentInjector) that you need:

```ts
import { provideEffect } from '@ngneat/effects-ng';
import { PostsEffects } from "posts/posts.effect.ts"

@NgModule({
  providers: [
    provideEffect(PostsEffects),
  ]
})
export class LazyModule {
}

-- OR --

export ROUTES = [
  ...,
  {
    path: 'lazy',
    loadChildren: () => import('./lazy-route/lazy.routes').then(mod => mod.ROUTES),
    providers: [provideEffect(PostsEffects)],
  }
]
```

The `Actions` class from `@ngneat/effects` has been injectable when using `@ngneat/effects-ng`.

To dispatch an action, simply inject `Actions`:

```ts
import { Actions } from '@ngneat/effects';

@Component(...)
export class AppComponent {
  constructor(private actions: Actions) {}

  ngOnInit() {
    this.actions.dispatch(loadTodos());
  }
}
```

> Registering an effects class multiple times, either by `forRoot()`, `forFeature()`, or `provideEffects()`, (for example in different lazy loaded features) will not cause the effects to run multiple times.

#### Directive Effects
`provideDirectiveEffects()` and `EffectsDirective` serve to register effects on the `component injector` level. This means that effects will live as long as the component where effects are registered lives. Do not forget to call `provideEffectsManager` in the root providers.

```ts
import { Actions } from "@ngneat/effects";
import { provideDirectiveEffects, EffectsDirective } from '@ngneat/effects-ng';

@Component({
  ...,
  providers: [provideDirectiveEffects(TodosEffects)],
  hostDirectives: [EffectsDirective],
})
export class TodosComponent {
  constructor(private actions: Actions) {}

  ngOnInit() {
    this.actions.dispatch(loadTodos());
  }
}
```

> If multiple components register the same effects via `provideDirectiveEffects() & EffectsDirective` it will not cause the effects to run multiple times. The effects will be running until the last component that registered these effects via `provideDirectiveEffects() & EffectsDirective` is destroyed. 
If the same effects were registered multiple times via `forRoot(), forFeature(), provideEffects()` and `provideDirectiveEffects() & EffectsDirective` then after the component is destroyed the effects will be still running.

### Testing

In order to test effect classes and using the actions stream from parameter you can substitute the action stream by a
custom created action stream. It's recommended to only use this feature for testing purposes.

```ts
describe("Effect test", () => {
  // use a custom action stream to replace the stream before each test
  let customActionsStream: Actions;

  beforeEach(() => {
    customActionsStream = new Actions();

    TestBed.configureTestingModule({
      providers: [
        provideEffectsManager({ customActionsStream }),
        provideEffect(EffectsOne),
      ]
    });
  })
})
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

  searchTodo = this.createEffectFn((searchTerm$: Observable<string>) => 
    searchTerm$.pipe(
      debounceTime(300),
      switchMap((searchTerm) => fetchTodos({ searchTerm })),
    );
  );
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
