import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error0',
  templateUrl: './error0.component.html'
})
export class Error0Component {

  constructor(
    public router: Router
  ) { }

  back() {
    this.router.navigate(['login']);
  }

}
