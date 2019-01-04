import { Component } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-error500',
  templateUrl: './error500.component.html'
})
export class Error500Component  {

  constructor(
    public location: Location
  ) {

  }

  back() {
    this.location.back();
  }

}
