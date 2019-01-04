import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-input-label-cell',
  templateUrl: './input-label-cell.component.html'
})

export class InputLabelCellComponent implements ICellEditorAngularComp {
  private params: any;
  public value: boolean;
  public name: string;
  public tooltipText: string;
  public tooltipName: string;
  public noVisible: boolean;

  constructor() { }

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.name = this.params.name;
    this.noVisible = this.params.noVisible;
    this.tooltipName = this.params.tooltipName;
    this.tooltipText = this.params.tooltipText ? this.params.tooltipText : null;
  }

  getValue(): any {
    return this.value;
  }

  cambiarEstadoCheckCabecera() {
    this.params.context.componentParent.cambiarEstadoCheckCabecera(this.value);
  }
}
