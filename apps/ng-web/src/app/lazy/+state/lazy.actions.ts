import { actionsFactory } from '@ngneat/effects';
import { props }          from 'ts-action';

const lazyActions = actionsFactory('lazy');

export const lazyActionOne = lazyActions.create('One');
export const lazyActionTwo = lazyActions.create('Two', props<{ lazy: string }>());
