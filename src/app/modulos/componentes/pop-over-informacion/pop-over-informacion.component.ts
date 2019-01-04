import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-pop-over-informacion',
  templateUrl: './pop-over-informacion.component.html'
})
export class PopOverInformacionComponent implements IHeaderAngularComp {
  public params: any;
  public informacion: string = "";
  public titulo: string = "";

  constructor() { }

  agInit(params: any): void {
    this.params = params;
    this.informacion = params.informacion ? params.informacion : "";
    this.titulo = params.titulo ? params.titulo : "";
  }

}
