import { createAction } from '../index';
import { capitalize }   from 'lodash';

type CreateAction = typeof createAction

export function actionsFactory(storeName: string): { create: CreateAction } {
  return {
    create: ((type, config) => {
      const modifiedStoreName = capitalize(storeName);
      return createAction(`[${modifiedStoreName}] ${type}`, config)
    }) as CreateAction
  };
}

