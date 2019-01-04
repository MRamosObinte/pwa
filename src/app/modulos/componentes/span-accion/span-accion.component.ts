import { Component, OnInit } from '@angular/core';
import { LS } from '../../../constantes/app-constants';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-span-accion',
  templateUrl: './span-accion.component.html',
  styleUrls: ['./span-accion.component.css']
})
export class SpanAccionComponent implements OnInit, ICellRendererAngularComp {

  public constantes: any;
  public params: any;
  public icono: string = "";
  public tooltip: string = "";
  public accion: string = "";
  public class:string="";
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

  ejecutarSpanAccion(event) {
    this.params.context.componentParent.ejecutarSpanAccion(event, this.params.data, this.accion);
  }
}
