import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AppAutonumeric } from '../../../../../directivas/autonumeric/AppAutonumeric';
import { LS } from '../../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { InputLabelCellComponent } from '../../../../componentes/input-label-cell/input-label-cell.component';
import { CheckboxCellComponent } from '../../../../componentes/checkbox-cell/checkbox-cell.component';
import { DecimalPipe } from '@angular/common';
import { NumericCellComponent } from '../../../../componentes/numeric-cell/numeric-cell.component';
import { CarFunCobrosSaldoAnticipoTO } from '../../../../../entidadesTO/cartera/CarFunCobrosSaldoAnticipoTO';

@Component({
  selector: 'app-cobro-anticipo-detalle',
  templateUrl: './cobro-anticipo-detalle.component.html'
})
export class CobroAnticipoDetalleComponent implements OnInit {

  @Input() totales: any = {};
  @Input() configAutonumericReales: AppAutonumeric;
  @Input() listadoCobrosAnticipos: Array<CarFunCobrosSaldoAnticipoTO> = new Array();
  @Input() accion: string = null;
  @Output() enviarAccion = new EventEmitter();

  public objetoSeleccionado: CarFunCobrosSaldoAnticipoTO = new CarFunCobrosSaldoAnticipoTO();
  public cobrarTodosCheck: boolean = false;
  public constantes: any = LS;
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
    this.completarTablaCobros();
    this.iniciarAgGrid();
  }

  generarOpciones() {
    let permiso = true;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_CONTABLE, icon: LS.ICON_CONSULTAR, disabled: !permiso, command: () => permiso ? this.verContable() : null },
    ];
  }

  verContable() {
    this.enviarAccion.emit({ accion: LS.ACCION_CONSULTAR_CONTABLE, objetoSeleccionado: this.objetoSeleccionado })
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
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
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
    if (event.colDef.field === "antValor") {
      this.cambioValor(event.data);
    }
  }

  ejecutarMetodoChecbox(data) {
    if (data.cobrar) {
      data.antValor = data.saldo;
    } else {
      data.antValor = 0;
    }
    this.gridApi ? this.gridApi.updateRowData({ update: [data] }) : null;
    this.calcularTotal();
  }

  cambiarEstadoCheckCabecera(data) {
    if (data) {
      this.gridApi.forEachNode((rowNode) => {
        var data = rowNode.data;
        data.antValor = data.saldo;
        data.cobrar = true;
      });
    } else {
      this.gridApi.forEachNode((rowNode) => {
        var data = rowNode.data;
        data.antValor = 0;
        data.cobrar = false;
      });
    }
    this.refreshGrid();
    this.calcularTotal();
  }

  cambioValor(data) {
    if (data.antValor === data.saldo) {
      data.cobrar = true;
    } else {
      data.cobrar = false;
    }
    this.gridApi ? this.gridApi.updateRowData({ update: [data] }) : null;
    this.calcularTotal();
  }

  calcularTotal() {
    this.cobrarTodosCheck = true;
    this.totales.anticipo = 0;
    this.gridApi.forEachNode((rowNode) => {
      var data = rowNode.data;
      this.totales.anticipo = this.mathRound2(this.totales.anticipo) + this.mathRound2(data.antValor);
      this.totales.diferencia = this.mathRound2(this.totales.cobro) - (this.mathRound2(this.totales.forma) + this.mathRound2(this.totales.anticipo));
      if (data.antValor != data.saldo) {
        this.cobrarTodosCheck = false;
      }
    });
  }

  completarTablaCobros() {
    this.cobrarTodosCheck = true;
    this.totales.anticipo = 0;
    if (this.listadoCobrosAnticipos) {
      for (let i = 0; i < this.listadoCobrosAnticipos.length; i++) {
        let data = this.listadoCobrosAnticipos[i];
        this.listadoCobrosAnticipos[i]['saldo'] = this.listadoCobrosAnticipos[i].antValor;
        this.listadoCobrosAnticipos[i].antValor = data.antValor ? data.antValor : 0;
        if (data.antValor === data['saldo']) {
          this.listadoCobrosAnticipos[i]['cobrar'] = true;
        } else {
          this.listadoCobrosAnticipos[i]['cobrar'] = false;
        }
        this.totales.anticipo = this.mathRound2(this.totales.anticipo) + this.mathRound2(data.antValor);
        this.totales.diferencia = this.mathRound2(this.totales.cobro) - (this.mathRound2(this.totales.forma) + this.mathRound2(this.totales.anticipo));
      }
    }
  }

  mathRound2(number) {
    number = this.utilService.quitarComasNumero(number);
    return Math.round(number * 100) / 100;
  }
  //#endregion

  generarColumnas(contexto): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_PERIODO,
        field: 'antPeriodo',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_TIPO,
        field: 'antTipo',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'antNumero',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'antFecha',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerComponentFramework: InputLabelCellComponent,
        headerClass: 'pr-0',
        headerComponentParams: { name: LS.TAG_COBRAR, value: contexto.cobrarTodosCheck, tooltipText: LS.TAG_COBRAR_TODO },
        cellClass: 'text-center',
        field: "cobrar",
        width: 150,
        minWidth: 100,
        cellRendererFramework: CheckboxCellComponent,
        cellRendererParams: (params) => { return { params: params.data.cobrar, ejecutarMetodo: true } },
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'antValor',
        width: 120,
        minWidth: 80,
        valueFormatter: numberFormatter,
        cellClass: 'text-right',
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'antValor', maxlength: 12, placeholder: '0.00', configAutonumeric: contexto.configAutonumericReales },
        suppressKeyboardEvent: (params) => {
          if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoCobrosAnticipos) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        editable: true,
        cellClassRules: {
          "cell-with-errors": (params) => {
            return this.utilService.quitarComasNumero(params.data.antValor) > params.data.saldo;
          }
        }
      },
      this.utilService.getColumnaOpciones()
    );
    return columnas;
  }

}

function numberFormatter(params) {
  if (!params.value) {
    params.value = 0;
  }
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
