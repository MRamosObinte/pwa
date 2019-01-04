import { Component, AfterViewInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { LS } from '../../../constantes/app-constants';

@Component({
  selector: 'app-select-cell',
  templateUrl: './select-cell.component.html'
})
export class SelectCellComponent implements ICellEditorAngularComp, AfterViewInit {
  private params: any;
  public value: any;
  public name: string;
  public class: string;
  public obligatorio: boolean = true;
  public ejecutarMetodoChange: boolean = true
  public ejecutarMetodoChangeAlterno: boolean = false
  public callbackCompareWith: string = null
  public listValues: Array<any> = [];
  public fieldsShow: Array<string> = [];
  public constantes = LS;
  @ViewChild('select', { read: ViewContainerRef }) public select;

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.obligatorio = this.params.obligatorio;
    this.ejecutarMetodoChange = this.params.ejecutarMetodoChange;
    this.ejecutarMetodoChangeAlterno = this.params.ejecutarMetodoChangeAlterno;
    this.callbackCompareWith = this.params.callbackCompareWith;
    this.name = this.params.name + '_' + params.rowIndex;
    this.class = this.params.selectClass ? this.params.selectClass : '';
    this.listValues = this.params.listValues ? this.params.listValues : [];
    this.fieldsShow = this.params.fieldsShow ? this.params.fieldsShow : [];
    // only start edit if key pressed is a number, not a letter
  }

  getValue(): any {
    return this.value;
  }

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    setTimeout(() => {
      this.select.element.nativeElement.focus();
    })
  }

  ejecutarMetodoDespues() {
    if (this.ejecutarMetodoChange) {
      this.params.context.componentParent.ejecutarMetodoChange(this.params, this.value);
    } else if (this.ejecutarMetodoChangeAlterno) {
      let puedeSeleccionar = this.params.context.componentParent.ejecutarMetodoChangeAlterno(this.params, this.value);
      if (!puedeSeleccionar) {
        this.value = null;
      }
    }
  }

  compareWith(o1, o2): boolean {
    return o1 && o2 ? o1.pisNumero === o2.pisNumero : o1 === o2;
  }

  valueFormatted(item): string {
    let display = "";
    for (let field of this.fieldsShow) {
      let arrayField = field.split('.');
      if (display !== "") {
        display = display + " - ";
      }
      if (arrayField.length > 1) {
        display = display + item[arrayField[0]][arrayField[1]];
      } else {
        display = display + item[field];
      }

    }
    return display;
  }
}