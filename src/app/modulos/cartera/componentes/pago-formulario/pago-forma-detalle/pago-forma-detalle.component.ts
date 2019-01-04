import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LS } from '../../../../../constantes/app-constants';
import { CarComboPagosCobrosFormaTO } from '../../../../../entidadesTO/cartera/CarComboPagosCobrosFormaTO';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { DecimalPipe } from '@angular/common';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { SelectCellComponent } from '../../../../componentes/select-cell/select-cell.component';
import { NumericCellComponent } from '../../../../componentes/numeric-cell/numeric-cell.component';
import { AppAutonumeric } from '../../../../../directivas/autonumeric/AppAutonumeric';
import { InputCellComponent } from '../../../../componentes/input-cell/input-cell.component';
import { CarPagosDetalleFormaTO } from '../../../../../entidadesTO/cartera/CarPagosDetalleFormaTO';

@Component({
  selector: 'app-pago-forma-detalle',
  templateUrl: './pago-forma-detalle.component.html'
})
export class PagoFormaDetalleComponent implements OnInit {

  @Input() listaFormaPago: Array<CarComboPagosCobrosFormaTO> = new Array();
  @Input() listadoDeFormasDePago: Array<CarPagosDetalleFormaTO> = new Array();
  @Input() totales: any = {};
  @Input() accion: string = null;
  @Input() configAutonumericReales: AppAutonumeric;

  public constantes: any = LS;
  public objetoSeleccionado: CarPagosDetalleFormaTO = new CarPagosDetalleFormaTO();
  public fpSeleccionada: CarComboPagosCobrosFormaTO = new CarComboPagosCobrosFormaTO();
  //AG-GRID
  public opciones: MenuItem[];
  @Input() gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  public noData = LS.MSJ_NO_HAY_DATOS;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.fpSeleccionada = this.listaFormaPago[0];
    this.iniciarAgGrid();
    this.accion == LS.ACCION_CREAR ? this.nuevoItem() : this.formatearFormasDePago();
  }

  nuevoItem() {
    let fc: CarPagosDetalleFormaTO = new CarPagosDetalleFormaTO();
    this.listadoDeFormasDePago.push(fc);
  }

  formatearFormasDePago() {
    this.totales.forma = 0;
    for (let i = 0; i < this.listadoDeFormasDePago.length; i++) {
      let data = this.listadoDeFormasDePago[i];
      this.listadoDeFormasDePago[i].detValor = data['fpValor'];
      this.listadoDeFormasDePago[i].detReferencia = data['fpReferencia'];
      this.listadoDeFormasDePago[i].detObservaciones = data['fpObservacion'];
      this.totales.forma = this.mathRound2(this.totales.forma) + this.mathRound2(this.listadoDeFormasDePago[i].detValor);
      this.totales.diferencia = this.mathRound2(this.totales.pago) - (this.mathRound2(this.totales.forma) + this.mathRound2(this.totales.anticipo));
    }
  }

  calcularTotal() {
    this.totales.forma = 0;
    this.gridApi.forEachNode((rowNode) => {
      var data = rowNode.data;
      this.totales.forma = this.mathRound2(this.totales.forma) + this.mathRound2(data.detValor);
      this.totales.diferencia = this.mathRound2(this.totales.pago) - (this.mathRound2(this.totales.forma) + this.mathRound2(this.totales.anticipo));
    });
  }

  mathRound2(number) {
    number = this.utilService.quitarComasNumero(number);
    return Math.round(number * 100) / 100;
  }

  generarOpciones(rowIndex) {
    let permiso = true;
    this.opciones = [
      { label: LS.ACCION_AGREGAR_FILA_ARRIBA, icon: LS.ICON_FLECHA_ARRIBA, disabled: !permiso, command: () => permiso ? this.agregarFila('up', rowIndex) : null },
      { label: LS.ACCION_AGREGAR_FILA_ABAJO, icon: LS.ICON_FLECHA_ABAJO, disabled: !permiso, command: () => permiso ? this.agregarFila('down', rowIndex) : null },
      { label: LS.ACCION_ELIMINAR_FILA, icon: LS.ICON_ELIMINAR, disabled: !permiso, command: () => permiso ? this.eliminarFila(rowIndex) : null },
    ];
  }

  agregarFila(ubicacion: string, rowIndex, noFocused?) {
    let index = rowIndex;
    if (index >= 0) {
      this.agregarFilaByIndex(index, ubicacion, noFocused);
    }
  }

  agregarFilaByIndex(index, ubicacion, noFocused?) {
    let indexNuevo = ubicacion === 'up' ? index : index + 1;
    var nuevoItem = new CarPagosDetalleFormaTO();
    this.listadoDeFormasDePago.splice(indexNuevo, 0, nuevoItem);
    this.gridApi ? this.gridApi.updateRowData({ add: [nuevoItem], addIndex: indexNuevo }) : null;
    !noFocused ? this.focusedFP(indexNuevo) : this.cantidadFocusAndEditingCell(index);
    this.refreshGrid();
  }

  focusedFP(index) {
    setTimeout(() => { this.FPFocusAndEditingCell(index) }, 50);
  }

  FPFocusAndEditingCell(index) {
    if (this.gridApi) {
      this.gridApi.setFocusedCell(index, 'fpSeleccionada');
      this.gridApi.startEditingCell({ rowIndex: index, colKey: "fpSeleccionada" });
    }
  }

  cantidadFocusAndEditingCell(index) {
    if (this.gridApi) {
      this.gridApi.setFocusedCell(index, "detValor");
      this.gridApi.startEditingCell({ rowIndex: index, colKey: "detValor" });
      this.gridApi.ensureIndexVisible(index + 1);
    }
  }

  eliminarFila(rowIndex) {
    if (this.listadoDeFormasDePago.length > 1) {
      let index = rowIndex;
      this.quitarElementoDeFila(index);
    }
  }

  quitarElementoDeFila(index) {
    this.listadoDeFormasDePago.splice(index, 1);
    this.gridApi ? this.gridApi.updateRowData({ remove: [this.objetoSeleccionado], addIndex: index }) : null;
    this.refreshGrid();
  }

  agregarFilaAlFinal(params) {
    let keyCode = params.event.keyCode;
    let index = params.node.rowIndex;
    this.objetoSeleccionado = this.listadoDeFormasDePago[index];
    if (this.utilService.validarKeyBuscar(keyCode) && this.accion === LS.ACCION_CREAR && index >= 0 && index === (this.listadoDeFormasDePago.length - 1)) {//falta la accion
      params.event.srcElement.blur();
      params.event.preventDefault();
      this.agregarFilaByIndex(index, 'down', false);
    }
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
  }

  mostrarOpciones(event, dataSelected) {
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    if (filasFocusedCell) {
      this.mostrarContextMenu(dataSelected, filasFocusedCell.rowIndex, event);
    }
  }

  mostrarContextMenu(data, rowIndex, event) {
    this.objetoSeleccionado = data;
    if (this.accion === LS.ACCION_CREAR) {
      this.generarOpciones(rowIndex);
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    let columna = filasFocusedCell ? filasFocusedCell.column : null;
    this.objetoSeleccionado = fila ? fila.data : null;
    this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
  }

  alCambiarValorDeCelda(event) {
    //Si finalizo de editar el codigo de producto, validar el codigo principal
    if (event.colDef.field === "detValor") {
      this.calcularTotal();
    }
  }
  //#endregion

  generarColumnas(contexto): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_FORMA_PAGO,
        field: 'fpForma',
        width: 100,
        minWidth: 100,
        maxWitdh: 100,
        hide: contexto.accion === LS.ACCION_CREAR
      },
      {
        headerName: LS.TAG_FORMA_PAGO,
        field: 'fpSeleccionada',
        width: 160,
        minWidth: 160,
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoDeFormasDePago)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellClass: 'text-center',
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !params.data.fpSeleccionada && contexto.accion === LS.ACCION_CREAR;
          }
        },
        editable: contexto.accion === LS.ACCION_CREAR,
        cellEditorFramework: SelectCellComponent,
        cellEditorParams: function (params) {
          var fpSeleccionada = params.data.fpSeleccionada ? params.data.fpSeleccionada : contexto.fpSeleccionada;
          return {
            value: fpSeleccionada,
            name: 'fpSeleccionada',
            obligatorio: true,
            listValues: contexto.listaFormaPago ? contexto.listaFormaPago : [],
            fieldsShow: ['fpDetalle']
          };
        },
        valueFormatter: function (params) {
          params.data.fpSeleccionada = params.data.fpSeleccionada ? params.data.fpSeleccionada : contexto.fpSeleccionada;
          if (params.data.fpSeleccionada) {
            return !params.node.rowPinned ? params.data.fpSeleccionada.fpDetalle : params.data.fpSeleccionada;
          }
          return contexto.fpSeleccionada ? contexto.fpSeleccionada.fpDetalle : '';
        },
        hide: contexto.accion != LS.ACCION_CREAR
      },
      {
        headerName: LS.TAG_REFERENCIA,
        field: 'detReferencia',
        width: 110,
        minWidth: 110,
        cellClass: "mousetrap",
        editable: contexto.accion === LS.ACCION_CREAR,
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoDeFormasDePago)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'detReferencia',
          inputClass: 'text-uppercase',
        }
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'detValor',
        valueFormatter: numberFormatter,
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoDeFormasDePago)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        width: 110,
        minWidth: 110,
        editable: contexto.accion === LS.ACCION_CREAR,
        cellClass: 'text-right',
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !params.data.detValor && contexto.accion === LS.ACCION_CREAR;
          }
        },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'detValor',
          maxlength: 12,
          placeholder: '0.00',
          configAutonumeric: contexto.configAutonumericReales
        }
      },
      {
        headerName: LS.TAG_OBSERVACION,
        field: 'detObservaciones',
        width: 200,
        minWidth: 200,
        cellClass: "mousetrap",
        editable: contexto.accion === LS.ACCION_CREAR,
        suppressKeyboardEvent: (params) => {
          contexto.agregarFilaAlFinal(params);
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoDeFormasDePago)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'detObservaciones',
          inputClass: 'text-uppercase',
        }
      }
    );
    if (this.accion === LS.ACCION_CREAR) {
      columnas.push(
        this.utilService.getColumnaOpciones()
      )
    }
    return columnas;
  }

}

function numberFormatter(params) {
  if (!params.value) {
    params.value = 0;
  }
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
