import { Effect, isEffect } from '@ngneat/effects';
import { Type } from '@angular/core';

export function getEffectPropsMap(instance: Type<any>): Map<string, Effect> {
  return Object.entries(instance).reduce<Map<string, Effect>>(
    (map, [key, value]: any) => {
      if (isEffect(value)) {
        map.set(key, value);
      }

      return map;
    },
    new Map()
  );
}
