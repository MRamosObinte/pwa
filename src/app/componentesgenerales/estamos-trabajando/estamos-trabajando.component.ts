import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-estamos-trabajando',
  templateUrl: './estamos-trabajando.component.html'
})
export class EstamosTrabajandoComponent {

  constructor(
    public location: Location
  ) {

  }

  back() {
    this.location.back();
  }

}
