import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from '../../../../../node_modules/ag-grid-angular';
import { LS } from '../../../constantes/app-constants';

@Component({
  selector: 'app-boton-accion',
  templateUrl: './boton-accion.component.html'
})
export class BotonAccionComponent implements OnInit, ICellRendererAngularComp {

  public constantes: any;
  public params: any;
  public icono: string = "";
  public tooltip: string = "";
  public accion: string = "";
  public class: string = "";

  constructor() { }

  ngOnInit() {
    this.constantes = LS;
  }

  agInit(params: any): void {
    this.params = params;
    if (params.accion) {
      this.icono = params.icono ? params.icono : "";
      this.tooltip = params.tooltip ? params.tooltip : "";
      this.accion = params.accion ? params.accion : "";
      this.class = params.class ? params.class : "";
    }
  }

  refresh(): boolean {
    return false;
  }

  ejecutarAccion(event) {
    this.params.context.componentParent.ejecutarAccion(this.params.data, this.accion);
  }

}