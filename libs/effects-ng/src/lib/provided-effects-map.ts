import { Type } from '@angular/core';
import { Effect } from '@ngneat/effects';

const providedEffectsSourceInstances = new Map<
  any,
  Map<ProvidedEffectToken, { sources: number; effect: Effect }>
>();

export type ProvidedEffectToken = `${string} - ${string}`;

export function getProvidedEffect(
  sourceInstance: any,
  effectToken: ProvidedEffectToken
): Effect | undefined {
  return providedEffectsSourceInstances.get(sourceInstance)?.get(effectToken)
    ?.effect;
}

export function generateProvidedEffectToken(
  provider: Type<any>,
  effectKey: string
): ProvidedEffectToken {
  return `${provider.name} - ${effectKey}`;
}

export function isEffectProvided(
  sourceInstance: any,
  effectToken: ProvidedEffectToken
): boolean {
  return !!providedEffectsSourceInstances.get(sourceInstance)?.has(effectToken);
}

export function provideEffect(
  sourceInstance: any,
  effectToken: ProvidedEffectToken,
  effect: Effect
): void {
  const providedEffectsMapBySourceInstance =
    providedEffectsSourceInstances.get(sourceInstance);

  if (providedEffectsMapBySourceInstance) {
    providedEffectsMapBySourceInstance.set(effectToken, { sources: 1, effect });
  } else {
    providedEffectsSourceInstances.set(
      sourceInstance,
      new Map([[effectToken, { sources: 1, effect }]])
    );
  }
}

export function increaseProvidedEffectSources(
  sourceInstance: any,
  effectToken: ProvidedEffectToken
): void {
  const providedEffectsMapBySourceInstance =
    providedEffectsSourceInstances.get(sourceInstance);
  const providedEffect = providedEffectsMapBySourceInstance?.get(effectToken);

  if (providedEffectsMapBySourceInstance && providedEffect) {
    const sources = providedEffect.sources ?? 0;

    providedEffectsMapBySourceInstance.set(effectToken, {
      ...providedEffect,
      sources: sources + 1,
    });
  }
}

export function decreaseProvidedEffectSources(
  sourceInstance: any,
  effectToken: ProvidedEffectToken
): void {
  const providedEffectsMapBySourceInstance =
    providedEffectsSourceInstances.get(sourceInstance);
  const providedEffect = providedEffectsMapBySourceInstance?.get(effectToken);

  if (providedEffectsMapBySourceInstance && providedEffect) {
    const sources = providedEffect.sources ?? 0;

    if (sources === 0 || sources - 1 === 0) {
      providedEffectsMapBySourceInstance.delete(effectToken);

      if (!providedEffectsMapBySourceInstance.size) {
        providedEffectsSourceInstances.delete(sourceInstance);
      }
    } else {
      providedEffectsMapBySourceInstance.set(effectToken, {
        ...providedEffect,
        sources: sources - 1,
      });
    }
  }
}
