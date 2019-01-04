import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class MenuResolve implements Resolve<any> {
  
  constructor(private auth: AuthService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    this.auth.getMenus(route.routeConfig['path']);
  }
}