import { actionsFactory } from '@ngneat/effects';
import { props }          from 'ts-action';

const testActions = actionsFactory('test');

export const testActionOne = testActions.create('One');
export const testActionTwo = testActions.create('Two', props<{ yes: string }>());
