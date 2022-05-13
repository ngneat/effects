import { MonoTypeOperatorFunction, Observable, Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { useMemo, useEffect } from 'react';

export function useEffectFn<R extends Effect$[]>(effects: R): ReturnTypes<R>;
export function useEffectFn<R extends Effect$>(effect: R): ReturnType<R>;
export function useEffectFn(effects: Effect$[] | Effect$): any {
  const { destroyed } = useUntilDestroyed();

  const result = useMemo(() => {
    const toArray = Array.isArray(effects) ? effects : [effects];

    return toArray.map(e => e(destroyed));
  }, [destroyed, effects]);


  return Array.isArray(effects) ? result : result[0];
}


type Effect$ = (destroyed$: Observable<boolean>) => (value: any) => void;
type ReturnTypes<T extends Effect$[]> = { [P in keyof T]: T[P] extends (...args: any) => infer R ? R : never };

function useUntilDestroyed() {
  const subject = useMemo(() => new Subject<boolean>(), []);

  const data = useMemo(() => ({
    untilDestroyed<T>(): MonoTypeOperatorFunction<T> {
      return takeUntil(subject.asObservable());
    },
    destroyed: subject.asObservable()
  }), [subject]);

  useEffect(() => {
    return () => subject.next(true);
  }, [subject]);

  return data;
}