import { Injectable, OnDestroy } from "@angular/core";
import { createEffectFn } from "@ngneat/effects";
import { Observable, Subject } from "rxjs";

@Injectable()
export class ComponentEffects implements OnDestroy {
  private destroy = new Subject<boolean>();

  createEffectFn<T>(factoryFn: (source: Observable<T>) => Observable<unknown>) {
    return createEffectFn(factoryFn)(this.destroy.asObservable());
  }

  ngOnDestroy() {
    this.destroy.next(true);
  }
}