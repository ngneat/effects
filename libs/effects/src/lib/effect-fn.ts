import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export function createEffectFn<T>(
  factoryFn: (source: Observable<T>) => Observable<unknown>
) {
  return function (destroyed$: Observable<boolean>) {
    const subject = new Subject<T>();

    factoryFn(subject.asObservable()).pipe(takeUntil(destroyed$)).subscribe();

    return function (value: T) {
      subject.next(value);
    };
  };
}
