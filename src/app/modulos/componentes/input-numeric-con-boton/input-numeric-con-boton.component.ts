import { Component, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { UtilService } from '../../../serviciosgenerales/util.service';
import { AppAutonumeric } from '../../../directivas/autonumeric/AppAutonumeric';

@Component({
  selector: 'app-input-numeric-con-boton',
  templateUrl: './input-numeric-con-boton.component.html'
})
export class InputNumericConBotonComponent implements ICellEditorAngularComp, AfterViewInit {

  private params: any;
  public value: number;
  public name: string;
  public idRender: string;
  public nombre: string;
  public maxlength: number;
  public placeholder: string;
  public configAutonumeric: AppAutonumeric;
  public clase: string;
  public title: string;

  @ViewChild('input', { read: ViewContainerRef }) public input;

  constructor(
    private utilService: UtilService,
  ) { }

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.nombre = this.params.name;
    this.name = this.params.name + '_' + params.rowIndex;
    this.idRender = this.params.idRender + '_' + params.rowIndex;
    this.maxlength = this.params.maxlength;
    this.placeholder = this.params.placeholder;
    this.configAutonumeric = this.params.configAutonumeric;
    this.clase = this.params.clase;
    this.title = this.params.title;

    // only start edit if key pressed is a number, not a letter
  }

  getValue(): any {
    this.value = Number(this.utilService.quitarComasNumero(this.value));
    return this.value;
  }

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    let elemento = document.getElementById(this.idRender);
    elemento ? elemento.blur() : null;
    setTimeout(() => {
      this.input.element.nativeElement.focus();
    })
  }


  accionAdicional() {
    this.params.context.componentParent.accionAdicional(this.params.node.data, this.nombre);
  }

}
