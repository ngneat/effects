import { EMPTY, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export function tapResult<Result, Error = unknown>(
  next: (next: Result) => void,
  error?: (error: Error) => void,
  complete?: () => void
): MonoTypeOperatorFunction<Result> {
  return (source: Observable<Result>) =>
    source.pipe(
      tap({
        next,
        error: error ?? (err => console.error(err)),
        complete,
      }),
      catchError(() => EMPTY)
    );
}
