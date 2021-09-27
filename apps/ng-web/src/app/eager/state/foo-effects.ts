import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { ComponentEffects } from '@ngneat/effects-ng';

@Injectable()
export class Foo extends ComponentEffects {

  addTodo = this.createEffectFn((value$: Observable<string>) => {
    return value$.pipe(
      tap(v => {
        console.log(v);
      })
    )
  })
}