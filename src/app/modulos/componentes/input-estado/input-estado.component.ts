import { Component, OnInit } from '@angular/core';
import { LS } from '../../../constantes/app-constants';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-input-estado',
  templateUrl: './input-estado.component.html'
})
export class InputEstadoComponent implements OnInit, ICellRendererAngularComp {

  constantes: any;
  public params: any;
  public valorActual: boolean = false;

  constructor() { }

  ngOnInit() {
    this.constantes = LS;
  }

  agInit(params: any): void {
    this.params = params;
    this.valorActual = this.params.value ? true : false;
  }

  refresh(): boolean {
    return false;
  }
}
