import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-checkbox-header',
  templateUrl: './checkbox-header.component.html'
})
export class CheckboxHeaderComponent implements ICellEditorAngularComp {
  private params: any;
  public value: boolean;
  public tooltipText: string;

  constructor() { }

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.tooltipText = this.params.tooltipText ? this.params.tooltipText : null;
  }

  getValue(): any {
    return this.value;
  }

  cambiarEstadoCheckCabecera() {
    this.params.context.componentParent.cambiarEstadoGeneral(this.value);
  }
}
