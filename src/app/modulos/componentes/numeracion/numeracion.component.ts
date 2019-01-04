import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-numeracion',
  templateUrl: './numeracion.component.html',
  styleUrls: ['./numeracion.component.css']
})
export class NumeracionComponent implements ICellEditorAngularComp {
  public name: string = null;
  public value: string = null;
  public obligatorio: boolean = false;
  public params: any;

  constructor() { }

  ngOnInit() {
  }

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.name = this.params.name + '_' + params.rowIndex;
    this.obligatorio = this.params.obligatorio;
    // only start edit if key pressed is a number, not a letter
  }
  getValue(): any {
    return this.value;
  }

}
