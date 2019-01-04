import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cargando',
  template: `
    <div class="pantalla-completa opaco">
      <div class="content text-center" style="padding-top: 20%">
        <i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i>
        <h5>Cargando....</h5>
      </div>
    </div>
  `,
  styleUrls: ['./cargando.component.css']
})
export class CargandoComponent implements OnInit {
  constructor() { }

  ngOnInit() {

  }

}
