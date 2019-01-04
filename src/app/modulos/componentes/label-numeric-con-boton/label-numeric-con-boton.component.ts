import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-label-numeric-con-boton',
  templateUrl: './label-numeric-con-boton.component.html'
})
export class LabelNumericConBotonComponent implements ICellRendererAngularComp {

  private params: any;
  public value: number;
  public clase: string;
  public title: string;
  public name: string;
  public id: string;
  public habilitarBtn: boolean = false;
  constructor(
  ) { }

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value ? this.params.value.toString().replace(/,/gi, "") : 0;
    this.clase = this.params.clase;
    this.title = this.params.title;
    this.name = this.params.name;
    this.id = this.params.id + '_' + params.rowIndex;
    this.habilitarBtn = this.params.habilitarBtn;
  }

  refresh(): boolean {
    return false;
  }

  accionAdicional() {
    this.params.context.componentParent.accionAdicional(this.params.data, this.params.name);
  }
}
