import { actionsFactory } from '@ngneat/effects';
import { props }          from 'ts-action';

interface EagerProps {
  id: string;
  name: string;
}

const eagerActions = actionsFactory('eager');

export const eagerActionOne = eagerActions.create('One');
export const eagerActionTwo = eagerActions.create('Two', props<EagerProps>());
