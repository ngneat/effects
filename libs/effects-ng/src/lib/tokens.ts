import { InjectionToken, Type } from '@angular/core';
import { EffectsManager } from '@ngneat/effects';

export const EFFECTS_PROVIDERS = new InjectionToken<Type<any>[]>(
  'EFFECTS_PROVIDERS'
);
export const EFFECTS_MANAGER = new InjectionToken<EffectsManager>(
  '@ngneat/effects Effects Manager'
);
