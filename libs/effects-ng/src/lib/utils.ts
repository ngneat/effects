import { Effect, isEffect } from '@ngneat/effects';
import { Type } from '@angular/core';

export function retrieveOnlyEffects(instance: Type<any>): Effect[] {
  return Object.values(instance).filter((v: any): v is Effect => isEffect(v));
}
