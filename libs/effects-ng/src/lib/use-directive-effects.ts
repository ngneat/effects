import {
  Directive,
  Type,
  inject,
  OnDestroy,
  Provider,
  InjectionToken,
} from '@angular/core';
import { EFFECTS_MANAGER } from './tokens';
import { getEffectPropsMap } from './utils';
import { Effect } from '@ngneat/effects';
import {
  isEffectProvided,
  increaseProvidedEffectSources,
  provideEffect,
  decreaseProvidedEffectSources,
  generateProvidedEffectToken,
  ProvidedEffectToken,
  getProvideEffectByToken,
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
  private readonly manager = inject(EFFECTS_MANAGER, { optional: true });
  private readonly providersEffectsTokens = new Set<ProvidedEffectToken>();

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
        const token = generateProvidedEffectToken(provider, key);

        this.providersEffectsTokens.add(token);

        if (isEffectProvided(token)) {
          increaseProvidedEffectSources(token);
        } else {
          provideEffect(token, effect);

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
    const effects = [...this.providersEffectsTokens].reduce<Effect[]>(
      (effects, token) => {
        const effect = getProvideEffectByToken(token);

        decreaseProvidedEffectSources(token);

        if (effect && !isEffectProvided(token)) {
          effects.push(effect);
        }

        return effects;
      },
      []
    );

    this.manager?.removeEffects(effects);
  }
}
