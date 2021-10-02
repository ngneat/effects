import { Injectable, OnDestroy } from "@angular/core";
import { createEffectFn } from "@ngneat/effects";
import { Observable, Subject } from "rxjs";

@Injectable()
export class EffectFn implements OnDestroy {
  private destroy = new Subject<boolean>();
  private destroy$ = this.destroy.asObservable();

  createEffectFn<T>(factoryFn: (source: Observable<T>) => Observable<unknown>) {
    return createEffectFn(factoryFn)(this.destroy$);
  }

  ngOnDestroy() {
    this.destroy.next(true);
  }
}
