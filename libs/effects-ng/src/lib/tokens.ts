import { InjectionToken, Type } from '@angular/core';
import { EffectsManager } from '@ngneat/effects';

export const EFFECTS_PROVIDERS = new InjectionToken<Type<any>[]>(
  '@ngneat/effects Effects providers'
);

/**
 * @deprecated Use the {@link EffectsManager} class from `@ngneat/effects` instead.
 */
export const EFFECTS_MANAGER = new InjectionToken<EffectsManager>(
  '@ngneat/effects Effects Manager'
);
