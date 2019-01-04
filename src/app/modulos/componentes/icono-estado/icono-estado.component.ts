import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { LS } from '../../../constantes/app-constants';

@Component({
  selector: 'app-icono-estado',
  templateUrl: './icono-estado.component.html'
})
export class IconoEstadoComponent implements OnInit, ICellRendererAngularComp {
  constantes: any;
  public params: any;
  public valorActual: string;

  constructor() { }

  ngOnInit() {
    this.constantes = LS;
  }

  agInit(params: any): void {
    this.params = params;
    this.valorActual = params.value ? params.value : '';
  }

  refresh(): boolean {
    return false;
  }
}
