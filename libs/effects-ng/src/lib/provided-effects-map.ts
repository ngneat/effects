import { Type } from '@angular/core';
import { Effect } from '@ngneat/effects';

const providedEffectsMap = new Map<
  ProvidedEffectToken,
  { sources: number; effect: Effect }
>();

export type ProvidedEffectToken = `${string} - ${string}`;

export function getProvideEffectByToken(
  effectToken: ProvidedEffectToken
): Effect | undefined {
  return providedEffectsMap.get(effectToken)?.effect;
}

export function generateProvidedEffectToken(
  provider: Type<any>,
  effectKey: string
): ProvidedEffectToken {
  return `${provider.name} - ${effectKey}`;
}

export function isEffectProvided(effectToken: ProvidedEffectToken): boolean {
  return providedEffectsMap.has(effectToken);
}

export function provideEffect(
  effectToken: ProvidedEffectToken,
  effect: Effect
): void {
  providedEffectsMap.set(effectToken, { sources: 1, effect });
}

export function increaseProvidedEffectSources(
  effectToken: ProvidedEffectToken
): void {
  const providedEffect = providedEffectsMap.get(effectToken);

  if (providedEffect) {
    const sources = providedEffect.sources ?? 0;

    providedEffectsMap.set(effectToken, {
      ...providedEffect,
      sources: sources + 1,
    });
  }
}

export function decreaseProvidedEffectSources(
  effectToken: ProvidedEffectToken
): void {
  const providedEffect = providedEffectsMap.get(effectToken);

  if (providedEffect) {
    const sources = providedEffect.sources ?? 0;

    if (sources === 0 || sources - 1 === 0) {
      providedEffectsMap.delete(effectToken);
    } else {
      providedEffectsMap.set(effectToken, {
        ...providedEffect,
        sources: sources - 1,
      });
    }
  }
}
