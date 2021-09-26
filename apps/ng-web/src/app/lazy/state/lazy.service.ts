import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LazyService {
  constructor() {
    console.log('LazyService constructor')
  }
}