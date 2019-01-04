import { Component } from '@angular/core';
import {Location} from '@angular/common';
@Component({
  selector: 'app-error403',
  templateUrl: './error403.component.html'
})
export class Error403Component {

  constructor(
    public location: Location
  ) {

  }

  back() {
    this.location.back();
  }

}
