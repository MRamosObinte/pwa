import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Languages } from '../constantes/idiomas/app-languages';

@Injectable()
export class TraducirResolve implements Resolve<any> {

  constructor() { }

  resolve() {
      Languages.setLanguage('es');
  }

}