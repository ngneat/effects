import { createEffect, EffectsManager, initEffects, registerEffects, removeAllEffects, removeEffects } from './effects-manager';
import { createAction }                                                                                from '../index';
import { props }                                                                                       from 'ts-action';
import { ofType }                                                                                      from 'ts-action-operators';

const actionOne   = createAction('Action One');
const actionTwo   = createAction('Action Two', props<{ value: string }>());
const actionThree = createAction('Action Three', props<{ value: string }>());

const effectOne    = createEffect(actions => actions.pipe(
    ofType(actionOne)
  )
);
const effectTwo    = createEffect(actions => actions.pipe(
    ofType(actionTwo)
  )
);
const effectThree  = createEffect(actions => actions.pipe(
    ofType(actionThree)
  )
);
const faultyEffect = createEffect(() => ({ faulty: 'test' }) as any);

describe('Effects Manager', () => {
  let effectsManager: EffectsManager;

  beforeEach(() => {
    effectsManager = initEffects();
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
    const spy = jest.spyOn(effectThree.source, 'subscribe');
    effectsManager['subscribeEffect'](effectThree);

    expect(spy).toHaveBeenCalled();
  });

  // todo not sure how to properly test this
  it('should unsubscribe an effect', () => {
    effectsManager['subscribeEffect'](effectThree);

    const sub = effectsManager['effects'].get(effectThree);
    const spy = jest.spyOn(sub, 'unsubscribe');

    effectsManager['unsubscribeEffect'](effectThree);

    expect(spy).toHaveBeenCalled()
  });

  it('should fail if wrong action format is provided', () => {
    try {
      effectsManager['subscribeEffect'](faultyEffect);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });
});
