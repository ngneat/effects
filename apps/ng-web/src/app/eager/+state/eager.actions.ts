import { actionsFactory } from '@ngneat/effects';
import { props }          from 'ts-action';

const eagerActions = actionsFactory('eager');

export const eagerActionOne = eagerActions.create('One');
export const eagerActionTwo = eagerActions.create('Two', props<{ eager: string }>());
