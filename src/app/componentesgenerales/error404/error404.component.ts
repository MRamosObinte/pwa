import { Component } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html'
})
export class Error404Component {

  constructor(
    public location: Location
  ) {

  }

  back() {
    this.location.back();
  }
}
