import { Component, ElementRef, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-checkbox-cell',
  templateUrl: './checkbox-cell.component.html'
})
export class CheckboxCellComponent implements ICellRendererAngularComp {
  @ViewChild('.checkbox') checkbox: ElementRef;
  public params: any;
  public ejecutarMetodo: boolean = false;

  constructor() { }

  refresh(): boolean {
    return false;
  }

  agInit(params: any): void {
    this.params = params;
    this.ejecutarMetodo = this.params.ejecutarMetodo;
  }

  public onChange(event) {
    this.params.data[this.params.colDef.field] = event.currentTarget.checked;
    if (this.ejecutarMetodo) {
      this.params.context.componentParent.ejecutarMetodoChecbox(this.params.data);
    }
  }
}
