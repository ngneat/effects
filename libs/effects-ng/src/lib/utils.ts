import { Effect, isEffect } from '@ngneat/effects';
import { Type } from '@angular/core';

export function getEffectProps(instance: Type<any>): Effect[] {
  return Object.values(instance).filter((v: any): v is Effect => isEffect(v));
}
