import {
  Directive,
  Type,
  inject,
  OnDestroy,
  Provider,
  InjectionToken,
} from '@angular/core';
import { getEffectPropsMap } from './utils';
import { Effect, EffectsManager } from '@ngneat/effects';
import {
  isEffectProvided,
  increaseProvidedEffectSources,
  provideEffect,
  decreaseProvidedEffectSources,
  generateProvidedEffectToken,
  ProvidedEffectToken,
  getProvidedEffect,
} from './provided-effects-map';

const EFFECTS_DIRECTIVE_PROVIDERS = new InjectionToken<Type<any>[]>(
  '@ngneat/effects Effects directive providers'
);

export function provideDirectiveEffects(...providers: Type<any>[]): Provider[] {
  return [
    ...providers,
    {
      provide: EFFECTS_DIRECTIVE_PROVIDERS,
      useValue: providers,
    },
  ];
}

@Directive({ standalone: true })
export class EffectsDirective implements OnDestroy {
  private readonly providers = inject(EFFECTS_DIRECTIVE_PROVIDERS, {
    self: true,
    optional: true,
  });
  private readonly manager = inject(EffectsManager, { optional: true });
  private readonly sourceInstancesWithProvidersEffectsTokens = new Map<
    any,
    ProvidedEffectToken
  >();

  constructor() {
    if (!this.manager) {
      throw new TypeError(
        "Effects manager wasn't found. Have you forgotten to provide it? Please call `provideEffectsManager` in the root providers."
      );
    }

    if (!this.providers) {
      throw new TypeError(
        'No one effect was provided on a directive level. Please use `EffectsDirective` along with `provideDirectiveEffects`'
      );
    }

    const effects: Effect[] = [];

    new Set(this.providers).forEach((provider) => {
      const instance = inject(provider, { self: true });

      getEffectPropsMap(instance).forEach((effect, key) => {
        const sourceInstance = Object.getPrototypeOf(instance);
        const token = generateProvidedEffectToken(provider, key);

        this.sourceInstancesWithProvidersEffectsTokens.set(
          Object.getPrototypeOf(instance),
          token
        );

        if (isEffectProvided(sourceInstance, token)) {
          increaseProvidedEffectSources(sourceInstance, token);
        } else {
          provideEffect(sourceInstance, token, effect);

          effects.push(effect);
        }
      });
    });

    if (effects.length) {
      this.manager?.registerEffects(effects);
    }
  }

  ngOnDestroy(): void {
    this.unregisterEffect();
  }

  private unregisterEffect(): void {
    const effects = [
      ...this.sourceInstancesWithProvidersEffectsTokens.entries(),
    ].reduce<Effect[]>((effects, [sourceInstance, token]) => {
      const effect = getProvidedEffect(sourceInstance, token);

      decreaseProvidedEffectSources(sourceInstance, token);

      if (effect && !isEffectProvided(sourceInstance, token)) {
        effects.push(effect);
      }

      return effects;
    }, []);

    this.manager?.removeEffects(effects);
  }
}
