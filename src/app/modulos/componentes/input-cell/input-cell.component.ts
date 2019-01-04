import { Component, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-input-cell',
  templateUrl: './input-cell.component.html'
})
export class InputCellComponent implements ICellEditorAngularComp, AfterViewInit {
  private params: any;
  public value: string;
  public name: string;
  public maxlength: number;
  public placeholder: string;
  public class: string;

  @ViewChild('input', { read: ViewContainerRef }) public input;

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.name = this.params.name + '_' + params.rowIndex;
    this.maxlength = this.params.maxlength;
    this.placeholder = this.params.placeholder;
    this.class = this.params.inputClass ? this.params.inputClass : '';

    // only start edit if key pressed is a number, not a letter
  }

  getValue(): any {
    if(this.params.inputClass && this.params.inputClass === 'text-uppercase' && this.value){
      this.value = this.value.toString().toUpperCase();
    }
    return this.value;
  }

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    setTimeout(() => {
      this.input.element.nativeElement.focus();
    })
  }
}