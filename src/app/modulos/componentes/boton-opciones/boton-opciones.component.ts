import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";
import { LS } from '../../../constantes/app-constants';

@Component({
  selector: 'app-boton-opciones',
  templateUrl: './boton-opciones.component.html'
})
export class BotonOpcionesComponent implements OnInit, ICellRendererAngularComp {

  constantes: any;
  public params: any;
  public titulo: string;
  public clase: string;
  public tipo: string;
  public condicion: boolean;//requerido para mostrar boton extra

  constructor() { }

  ngOnInit() {
    this.constantes = LS;
  }

  agInit(params: any): void {
    this.params = params;
    this.titulo = params.titulo;
    this.clase = params.clase;
    this.condicion = params.condicion;
    this.tipo = params.tipo;
  }

  refresh(): boolean {
    return false;
  }

  mostrarOpciones(event) {
    this.params.context.componentParent.mostrarOpciones(event, this.params.data, this.tipo)
  }

  //ejecutar acciones adicionales con boton extra, visible solo con parametro opciones
  accionAdicional() {
    this.params.context.componentParent.accionAdicional(this.params.data);
  }

}
