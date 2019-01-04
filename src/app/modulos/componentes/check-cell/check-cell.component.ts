import { Component, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-check-cell',
  templateUrl: './check-cell.component.html'
})
export class CheckCellComponent implements ICellEditorAngularComp, AfterViewInit {
  private params: any;
  public value: boolean;
  public name: string;
  public clase: string;

  @ViewChild('input', { read: ViewContainerRef }) public input;

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.clase = this.params.clase;
    this.name = this.params.name + '_' + params.rowIndex;
  }

  getValue(): any {
    return this.value;
  }

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    setTimeout(() => {
      this.input.element.nativeElement.focus();
    })
  }
}