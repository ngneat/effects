import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LazyDirectiveEffectsService {
  constructor() {
    console.log('LazyDirectiveEffectsService constructor');
  }
}
