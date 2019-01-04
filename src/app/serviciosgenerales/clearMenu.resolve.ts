import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { LS } from '../constantes/app-constants';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ClearMenuResolve implements Resolve<any> {

  private menuC$ = new Subject<boolean>();

  constructor() { }

  resolve() {
    localStorage.removeItem(LS.KEY_CURRENT_MENU);
    localStorage.removeItem(LS.KEY_CURRENT_BREADCRUM);
    localStorage.removeItem(LS.KEY_CURRENT_TIEMPO);
    localStorage.removeItem(LS.KEY_CURRENT_FILAS);
    this.menuC$.next(true);
  }

  getMenuCambio$(): Observable<boolean> {
    return this.menuC$.asObservable();
  }

}