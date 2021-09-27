import { Injectable }                         from '@angular/core';
import { TestBed }                            from '@angular/core/testing';
import { EFFECTS_PROVIDERS, EffectsNgModule } from './effects-ng.module';

@Injectable()
class EffectsOne {
}

@Injectable()
class EffectsTwo {
}

@Injectable()
class EffectsThree {
}

describe('Effects ng module', () => {

  it('should provide effects one using forRoot', () => {
    TestBed.configureTestingModule({
      imports: [EffectsNgModule.forRoot([EffectsOne])]
    });

    const effectsOneInstance = TestBed.inject(EffectsOne);
    expect(effectsOneInstance).toBeDefined();
  });

  it('should provide for feature effects', () => {
    TestBed.configureTestingModule({
      imports: [
        EffectsNgModule.forRoot([EffectsOne]),
        EffectsNgModule.forFeature([EffectsTwo, EffectsThree])
      ]
    });

    const effectsProviders = TestBed.inject<any>(EFFECTS_PROVIDERS);

    expect(effectsProviders[0]).toEqual([EffectsOne]);
    expect(effectsProviders[1]).toEqual([EffectsTwo, EffectsThree]);
  });

});
