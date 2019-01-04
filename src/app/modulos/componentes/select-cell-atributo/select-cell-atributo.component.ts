import { Component, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-select-cell-atributo',
  templateUrl: './select-cell-atributo.component.html'
})
export class SelectCellAtributoComponent implements ICellEditorAngularComp, AfterViewInit {

  private params: any;
  public value: any;
  public atributo: any;
  public name: string;
  public class: string;
  public obligatorio: boolean = true;
  public ejecutarMetodoChange: boolean = false;
  public listValues: Array<any> = [];
  public fieldsShow: Array<string> = [];

  @ViewChild('select', { read: ViewContainerRef }) public select;

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.atributo = this.params.atributo;
    this.obligatorio = this.params.obligatorio;
    this.ejecutarMetodoChange = this.params.ejecutarMetodoChange;
    this.name = this.params.name + '_' + params.rowIndex;
    this.class = this.params.selectClass ? this.params.selectClass : '';
    this.listValues = this.params.listValues ? this.params.listValues : [];
    this.fieldsShow = this.params.fieldsShow ? this.params.fieldsShow : [];
    // only start edit if key pressed is a number, not a letter
  }

  getValue(): any {
    return this.value;
  }

  getAtributo(): any {
    return this.atributo;
  }

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    setTimeout(() => {
      this.select.element.nativeElement.focus();
    })
  }

  ejecutarMetodoDespues() {
    if (this.ejecutarMetodoChange) {
      this.params.context.componentParent.ejecutarMetodoChangeAtributo(this.params, this.value);
    }
  }

  valueFormatted(item): string {
    let display = "";
    for (let field of this.fieldsShow) {
      if (display !== "") {
        display = display + " - ";
      }
      display = display + item[field];
    }
    return display;
  }

}
