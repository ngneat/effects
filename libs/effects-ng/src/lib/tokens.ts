import { InjectionToken, Type } from '@angular/core';

export const _ROOT_EFFECTS = new InjectionToken<Type<any>[]>('@ngneat/effects Internal Root Effects');

export const ROOT_EFFECT_INSTANCES = new InjectionToken<Type<any>[]>('@ngneat/effects Root Effects');

export const _FEATURE_EFFECTS = new InjectionToken<Type<any>[]>('@ngneat/effects Internal Feature Effects');

export const FEATURE_EFFECT_INSTANCES = new InjectionToken<Type<any>[]>('@ngneat/effects Feature Effects');

export const EFFECTS_MANAGER = new InjectionToken("@ngneat/effects Effects Manager")
