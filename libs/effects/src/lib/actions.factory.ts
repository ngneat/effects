import { createAction } from '../index';

type CreateAction = typeof createAction

export function actionsFactory(storeName: string): { create: CreateAction } {
  return {
    create: ((type, config) =>
      createAction(`[${storeName}] ${type}`, config)) as CreateAction
  };
}
