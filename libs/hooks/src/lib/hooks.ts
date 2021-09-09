import { Effect, registerEffects, removeEffects } from '@ngneat/effects';
import { useEffect } from 'react';

export function useEffects(effects: Effect | Effect[]) {
  useEffect(() => {
    registerEffects(effects);

    return () => {
      removeEffects(effects);
    };
  }, []);
}
