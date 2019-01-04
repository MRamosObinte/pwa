import { Component } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-error501',
  templateUrl: './error501.component.html'
})
export class Error501Component {

  constructor(
    public location: Location
  ) {

  }

  back() {
    this.location.back();
  }

}
