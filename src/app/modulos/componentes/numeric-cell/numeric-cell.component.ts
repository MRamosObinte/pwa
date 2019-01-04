import { Component, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { AppAutonumeric } from '../../../directivas/autonumeric/AppAutonumeric';
import { UtilService } from '../../../serviciosgenerales/util.service';

@Component({
  selector: 'app-numeric-cell',
  templateUrl: './numeric-cell.component.html'
})
export class NumericCellComponent implements ICellEditorAngularComp, AfterViewInit {
  private params: any;
  public value: number;
  public name: string;
  public maxlength: number;
  public placeholder: string;
  public configAutonumeric: AppAutonumeric;

  @ViewChild('input', { read: ViewContainerRef }) public input;

  constructor(
    private utilService: UtilService,
  ) { }

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.name = this.params.name + '_' + params.rowIndex;
    this.maxlength = this.params.maxlength;
    this.placeholder = this.params.placeholder;
    this.configAutonumeric = this.params.configAutonumeric;
    // only start edit if key pressed is a number, not a letter
  }

  getValue(): any {
    this.value = Number(this.utilService.quitarComasNumero(this.value));
    return this.value;
  }

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    setTimeout(() => {
      this.input.element.nativeElement.focus();
    })
  }
}