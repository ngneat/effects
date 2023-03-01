import { map } from 'rxjs';
import { props } from 'ts-action';
import { ofType } from 'ts-action-operators';
import { createAction, createEffect } from '../index';
import { actions } from './actions';
import {
  EffectsManager,
  initEffects,
  registerEffects,
  removeAllEffects,
  removeEffects,
} from './effects-manager';

const actionOne = createAction('Action One');
const actionTwo = createAction('Action Two', props<{ value: string }>());
const actionThree = createAction('Action Three', props<{ value: string }>());
const actionFour = createAction('Action Four');
const actionFive = createAction('Action Five');
const actionSix = createAction('Action Six');
const actionSeven = createAction('Action Seven');

const effectOne = createEffect((actions) => actions.pipe(ofType(actionOne)));
const effectTwo = createEffect((actions) => actions.pipe(ofType(actionTwo)));
const effectThree = createEffect((actions) =>
  actions.pipe(ofType(actionThree))
);
const effectFour = createEffect((actions) => actions);
const effectFive = createEffect(
  (actions) =>
    actions.pipe(
      ofType(actionOne),
      map(() => actionFour())
    ),
  { dispatch: false }
);
const effectSix = createEffect((actions) =>
  actions.pipe(
    ofType(actionFive),
    map(() => actionSix())
  )
);
const effectSeven = createEffect((actions) =>
  actions.pipe(
    ofType(actionSix),
    map(() => [actionSeven()])
  )
);
const effectEight = createEffect(
  (actions) =>
    actions.pipe(
      ofType(actionFive),
      map(() => actionSix())
    ),
  { dispatch: true }
);
const effectNine = createEffect(
  (actions) =>
    actions.pipe(
      ofType(actionSix),
      map(() => [actionSeven()])
    ),
  { dispatch: true }
);

const faultyEffect = createEffect(() => ({ faulty: 'test' } as any));

describe('Effects Manager', () => {
  let effectsManager: EffectsManager;
  const dispatchSpy = jest.spyOn(actions, 'dispatch');

  beforeEach(() => {
    effectsManager = initEffects();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register effects', () => {
    registerEffects(effectOne);
    registerEffects(effectTwo);

    const effects = effectsManager['effects'];
    expect(effects.has(effectOne)).toBe(true);
    expect(effects.has(effectTwo)).toBe(true);
  });

  it('should remove effects', () => {
    registerEffects(effectOne);
    registerEffects(effectTwo);

    const effects = effectsManager['effects'];
    expect(effects.has(effectOne)).toBe(true);
    expect(effects.has(effectTwo)).toBe(true);

    removeEffects([effectOne, effectTwo]);
    expect(effects.has(effectOne)).toBe(false);
    expect(effects.has(effectTwo)).toBe(false);
  });

  it('should remove all effects', () => {
    registerEffects(effectOne);
    registerEffects(effectTwo);

    const effects = effectsManager['effects'];
    expect(effects.has(effectOne)).toBe(true);
    expect(effects.has(effectTwo)).toBe(true);

    removeAllEffects();
    expect(effectsManager['effects'].has(effectOne)).toBe(false);
    expect(effectsManager['effects'].has(effectTwo)).toBe(false);
  });

  it('should subscribe to an effect', () => {
    const source = effectFour.sourceFn(actions);
    const spy = jest.spyOn(source, 'subscribe');

    effectsManager['subscribeEffect'](effectFour);

    expect(spy).toHaveBeenCalled();
  });

  // todo not sure how to properly test this
  it('should unsubscribe an effect', () => {
    effectsManager['subscribeEffect'](effectThree);

    const sub = effectsManager['effects'].get(effectThree);
    const spy = jest.spyOn(sub, 'unsubscribe');

    effectsManager['unsubscribeEffect'](effectThree);

    expect(spy).toHaveBeenCalled();
  });

  it('should fail if wrong action format is provided', () => {
    try {
      effectsManager['subscribeEffect'](faultyEffect);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should not dispatch an action from an effect when dispatchByDefault is set to true and dispatch is set to false', () => {
    // have to create a new EffectsManager bypassing initEffects() to get an instance with a different config
    effectsManager = new EffectsManager({ dispatchByDefault: true });
    effectsManager.registerEffects([effectFive]);

    actions.dispatch(actionOne());

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('should dispatch actions from an effect when dispatchByDefault is set to true or dispatch is not set', () => {
    // have to create a new EffectsManager bypassing initEffects() to get an instance with a different config
    effectsManager = new EffectsManager({ dispatchByDefault: true });
    effectsManager.registerEffects([effectSix, effectSeven]);

    actions.dispatch(actionFive());

    effectsManager.removeAllEffects();

    expect(dispatchSpy).toHaveBeenCalledTimes(3);
  });

  it('should dispatch actions from an effect when dispatch is set to true', () => {
    registerEffects([effectEight, effectNine]);

    actions.dispatch(actionFive());

    expect(dispatchSpy).toHaveBeenCalledTimes(3);
  });
});
