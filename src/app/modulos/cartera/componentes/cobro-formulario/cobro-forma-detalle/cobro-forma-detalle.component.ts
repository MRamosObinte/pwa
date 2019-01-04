import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LS } from '../../../../../constantes/app-constants';
import { CarComboPagosCobrosFormaTO } from '../../../../../entidadesTO/cartera/CarComboPagosCobrosFormaTO';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { CarCobrosDetalleFormaTO } from '../../../../../entidadesTO/cartera/CarCobrosDetalleFormaTO';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { AppAutonumeric } from '../../../../../directivas/autonumeric/AppAutonumeric';
import { ContableListadoService } from '../../../../contabilidad/transacciones/contable-listado/contable-listado.service';
import { ListaBanBancoTO } from '../../../../../entidadesTO/banco/ListaBanBancoTO';
import { CobroFormaDetalleService } from './cobro-forma-detalle.service';

@Component({
  selector: 'app-cobro-forma-detalle',
  templateUrl: './cobro-forma-detalle.component.html'
})
export class CobroFormaDetalleComponent implements OnInit {

  @Input() listaFormaPago: Array<CarComboPagosCobrosFormaTO> = new Array();
  @Input() listadoDeFormasDeCobro: Array<CarCobrosDetalleFormaTO> = new Array();
  @Input() bancos: Array<ListaBanBancoTO> = new Array();
  @Input() totales: any = {};
  @Input() fechaActual: Date = new Date();
  @Input() accion: string = null;
  @Input() configAutonumericReales: AppAutonumeric;

  public constantes: any = LS;
  public objetoSeleccionado: CarCobrosDetalleFormaTO = new CarCobrosDetalleFormaTO();
  public fpSeleccionada: CarComboPagosCobrosFormaTO = new CarComboPagosCobrosFormaTO();
  public bancoSeleccionado: ListaBanBancoTO = new ListaBanBancoTO();
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

  public esPostFechado: boolean = false;
  public inputCuenta: AppAutonumeric;

  constructor(
    private utilService: UtilService,
    private contableService: ContableListadoService,
    private cobroFormaDetalleService: CobroFormaDetalleService
  ) {
    this.inputCuenta = {
      decimalPlaces: 0,
      decimalPlacesRawValue: 0,
      decimalPlacesShownOnBlur: 0,
      decimalPlacesShownOnFocus: 0,
      maximumValue: '999999999999'
    }
  }

  ngOnInit() {
    this.fpSeleccionada = this.listaFormaPago[0];
    this.bancoSeleccionado = this.bancos[0];
    this.esPostFechado = this.isCtaPostfechado();
    this.iniciarAgGrid();
    this.accion == LS.ACCION_CREAR ? this.nuevoItem() : this.formatearFormasDeCobro();
  }

  nuevoItem() {
    let fc: CarCobrosDetalleFormaTO = new CarCobrosDetalleFormaTO();
    this.listadoDeFormasDeCobro.push(fc);
  }

  isCtaPostfechado(): boolean {
    if (this.listaFormaPago && this.listaFormaPago.length > 0) {
      for (let i = 0; i < this.listaFormaPago.length; i++) {
        if (this.listaFormaPago[i].postFechados) {
          return true;
        }
      }
    }
    return false;
  }

  formatearFormasDeCobro() {
    this.totales.forma = 0;
    for (let i = 0; i < this.listadoDeFormasDeCobro.length; i++) {
      let data = this.listadoDeFormasDeCobro[i];
      this.listadoDeFormasDeCobro[i].detValor = data['fpValor'];
      this.listadoDeFormasDeCobro[i].detReferencia = data['fpReferencia'];
      this.listadoDeFormasDeCobro[i].detObservaciones = data['fpObservacion'];
      this.totales.forma = this.mathRound2(this.totales.forma) + this.mathRound2(this.listadoDeFormasDeCobro[i].detValor);
      this.totales.diferencia = this.mathRound2(this.totales.cobro) - (this.mathRound2(this.totales.forma) + this.mathRound2(this.totales.anticipo));
    }
  }

  calcularTotal() {
    this.totales.forma = 0;
    this.gridApi.forEachNode((rowNode) => {
      var data = rowNode.data;
      this.totales.forma = this.mathRound2(this.totales.forma) + this.mathRound2(data.detValor);
      this.totales.diferencia = this.mathRound2(this.totales.cobro) - (this.mathRound2(this.totales.forma) + this.mathRound2(this.totales.anticipo));
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
    var nuevoItem = new CarCobrosDetalleFormaTO();
    this.listadoDeFormasDeCobro.splice(indexNuevo, 0, nuevoItem);
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
    if (this.listadoDeFormasDeCobro.length > 1) {
      let index = rowIndex;
      this.quitarElementoDeFila(index);
    }
  }

  quitarElementoDeFila(index) {
    this.listadoDeFormasDeCobro.splice(index, 1);
    this.gridApi ? this.gridApi.updateRowData({ remove: [this.objetoSeleccionado], addIndex: index }) : null;
    this.refreshGrid();
  }

  agregarFilaAlFinal(params) {
    let keyCode = params.event.keyCode;
    let index = params.node.rowIndex;
    this.objetoSeleccionado = this.listadoDeFormasDeCobro[index];
    if (this.utilService.validarKeyBuscar(keyCode) && this.accion === LS.ACCION_CREAR && index >= 0 && index === (this.listadoDeFormasDeCobro.length - 1)) {//falta la accion
      params.event.srcElement.blur();
      params.event.preventDefault();
      this.agregarFilaByIndex(index, 'down', false);
    }
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.cobroFormaDetalleService.generarColumnas(this);
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
    if (event.colDef.field === "fpSeleccionada" || event.colDef.field === "detReferencia") {
      this.verificarDocumentoBanco(event.data);
    }
  }

  verificarDocumentoBanco(data) {
    data.errorEnDocumento = true;//docuemnto valido
    this.gridApi ? this.gridApi.updateRowData({ update: [data] }) : null;
    if (data.detReferencia && data.fpSeleccionada && data.fpSeleccionada.validar) {//si hay valor de anticipo, valor en documento y se tiene q valirdar cuenta
      let parametro = {
        empresa: LS.KEY_EMPRESA_SELECT,
        documento: data.detReferencia,//documento ingresado en el input
        cuenta: data.fpSeleccionada.ctaCodigo,//cuanta contable de la forma de pago
        data: data //registro cambiado de la tabla, si hay un seleccionado: usar el seleccionado
      }
      this.contableService.verificarDocumentoBanco(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      data.errorEnDocumento = false;//docuemnto valido
      this.gridApi ? this.gridApi.updateRowData({ update: [data] }) : null;
      this.validarDocumentosRepetido();//ver si hay repetidos enla tabla
    }
  }

  despuesDeVerificarDocumento(data, registro) {
    registro.errorEnDocumento = !data;//documento erroneo desde la base de datos
    this.gridApi ? this.gridApi.updateRowData({ update: [registro] }) : null;
    this.validarDocumentosRepetido();//ver si hay repetidos en la tabla
  }

  validarDocumentosRepetido() {
    this.listadoDeFormasDeCobro.forEach(item => {
      let itemNecesitaVerificacion = item['detReferencia'] && item['fpSeleccionada'] && item['fpSeleccionada']['validar'];//cumple los requisitos para validar registro
      let arrayRepetidos = this.listadoDeFormasDeCobro.filter(value =>
        (itemNecesitaVerificacion && value['fpSeleccionada'] && value['fpSeleccionada']['validar'] && value['detReferencia'] && value !== item && value['detReferencia'].trim() === item['detReferencia'].trim())
      );
      item['documentoRepetido'] = (arrayRepetidos.length > 0);
    });
    this.refreshGrid();
  }
  //#endregion
}
