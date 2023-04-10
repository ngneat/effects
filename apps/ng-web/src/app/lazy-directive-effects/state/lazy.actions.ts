import { actionsFactory } from '@ngneat/effects';
import { props } from 'ts-action';

const lazyDirectiveEffectsActions = actionsFactory('lazy-directive-effects');

export const lazyDirectiveEffectsActionOne =
  lazyDirectiveEffectsActions.create('One');
export const lazyDirectiveEffectsActionTwo = lazyDirectiveEffectsActions.create(
  'Two',
  props<{ lazy: string }>()
);
