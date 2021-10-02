import { MonoTypeOperatorFunction, Observable, Subject, takeUntil } from "rxjs";
import { useRef, useMemo, useEffect } from 'react';

export function useEffectFn<R extends Effect$[]>(effects: R): ReturnTypes<R>;
export function useEffectFn<R extends Effect$>(effect: R): ReturnType<R>;
export function useEffectFn(effects: Effect$[] | Effect$): any {
  const { destroyed } = useUntilDestroyed();
  const result = useRef<any>([]);

  useMemo(() => {
    const toArray = Array.isArray(effects) ? effects : [effects];

    toArray.forEach((e, i) => result.current[i] = e(destroyed));

    return result.current;
  }, [destroyed, effects]);

  return Array.isArray(effects) ? result.current as unknown : result.current[0];
}


type Effect$ = (destroyed$: Observable<boolean>) => (value: any) => void;
type ReturnTypes<T extends Effect$[]> = { [P in keyof T]: T[P] extends (...args: any) => infer R ? R : never };

// TODO: take from ngneat/react-rxjs
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