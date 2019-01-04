import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { RhEmpleadoDescuentosFijos } from '../../../../../entidades/rrhh/RhEmpleadoDescuentosFijos';
import { RhAnticipoMotivo } from '../../../../../entidades/rrhh/RhAnticipoMotivo';
import { GridApi } from 'ag-grid';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { LS } from '../../../../../constantes/app-constants';
import { SelectCellComponent } from '../../../../componentes/select-cell/select-cell.component';
import { DecimalPipe } from '@angular/common';
import { AppAutonumeric } from '../../../../../directivas/autonumeric/AppAutonumeric';
import { NumericCellComponent } from '../../../../componentes/numeric-cell/numeric-cell.component';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { RhEmpleado } from '../../../../../entidades/rrhh/RhEmpleado';

@Component({
  selector: 'app-descuentos',
  templateUrl: './descuentos.component.html'
})
export class DescuentosComponent implements OnInit {

  @Input() descuentos: Array<RhEmpleadoDescuentosFijos> = new Array();
  @Input() motivosDeAnticipos: Array<RhAnticipoMotivo> = new Array();
  @Input() autonumeric92: AppAutonumeric;//9,2
  @Input() empleado: RhEmpleado = new RhEmpleado();//9,2
  @Input() accion: string = null;//9,2

  public objetoSeleccionado: RhEmpleadoDescuentosFijos = new RhEmpleadoDescuentosFijos();
  public constantes: any = LS;
  //AG-GRID
  @Input() gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];

  constructor(
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.iniciarAgGrid();
  }

  construirDescuentos() {
    if (this.descuentos) {
      for (let i = 0; i < this.descuentos.length; i++) {
        let motivo = this.motivosDeAnticipos.find(item => item.rhAnticipoMotivoPK.motDetalle === this.descuentos[i].rhAnticipoMotivo.rhAnticipoMotivoPK.motDetalle);
        this.descuentos[i].rhAnticipoMotivo = motivo;
      }
    }
  }

  nuevo() {
    let descuento: RhEmpleadoDescuentosFijos = new RhEmpleadoDescuentosFijos();
    this.descuentos.push(descuento);
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.generarColumnas(this);
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.redimensionarColumnas();
    this.seleccionarFila(0);
    this.construirDescuentos();
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    if (this.accion != LS.ACCION_CONSULTAR) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  generarOpciones() {
    let permiso = true;
    this.opciones = [
      { label: LS.ACCION_AGREGAR_FILA_ARRIBA, icon: LS.ICON_FLECHA_ARRIBA, disabled: !permiso, command: () => permiso ? this.agregarFila('up') : null },
      { label: LS.ACCION_AGREGAR_FILA_ABAJO, icon: LS.ICON_FLECHA_ABAJO, disabled: !permiso, command: () => permiso ? this.agregarFila('down') : null },
      { label: LS.ACCION_ELIMINAR_FILA, icon: LS.ICON_ELIMINAR, disabled: !permiso, command: () => permiso ? this.eliminarFila() : null },
    ];
  }

  agregarFila(ubicacion: string, noFocused?) {
    let index = this.descuentos.indexOf(this.objetoSeleccionado);
    if (index >= 0) {
      index = ubicacion === 'up' ? index : index + 1;
      var nuevoItem = new RhEmpleadoDescuentosFijos();
      this.descuentos.splice(index, 0, nuevoItem);
      this.gridApi ? this.gridApi.updateRowData({ add: [nuevoItem], addIndex: index }) : null;
      !noFocused ? this.focusedProducto(index) : null;
      this.refreshGrid();
    }
  }

  eliminarFila() {
    if (this.descuentos.length > 1) {
      let index = this.descuentos.indexOf(this.objetoSeleccionado);
      this.quitarElementoDeFila(index);
    }
  }

  quitarElementoDeFila(index) {
    this.descuentos.splice(index, 1);
    this.gridApi ? this.gridApi.updateRowData({ remove: [this.objetoSeleccionado], addIndex: index }) : null;
    this.refreshGrid();
  }

  focusedProducto(index) {
    setTimeout(() => { this.productoFocusAndEditingCell(index) }, 50);
  }

  productoFocusAndEditingCell(index) {
    if (this.gridApi) {
      this.gridApi.setFocusedCell(index, 'rhAnticipoMotivo');
      this.gridApi.startEditingCell({ rowIndex: index, colKey: "rhAnticipoMotivo" });
    }
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    let columna = filasFocusedCell ? filasFocusedCell.column : null;
    this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  seleccionarFila(index) {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(index, firstCol);
    }
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
  }

  generarColumnas(contexto) {
    let empleado: RhEmpleado = contexto.empleado;
    let columnas = [];
    let esEditable = true;
    columnas.push(
      {
        headerName: LS.TAG_DETALLE,
        field: 'rhAnticipoMotivo',
        width: 180,
        minWidth: 180,
        maxWidth: 180,
        editable: esEditable,
        cellEditorFramework: SelectCellComponent,
        suppressKeyboardEvent: (params) => {
          if (params.editing) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.descuentos)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        valueFormatter: function (params) {
          return params.data.rhAnticipoMotivo ? params.data.rhAnticipoMotivo.rhAnticipoMotivoPK.motDetalle : '';
        },
        cellEditorParams: function (params) {
          var rhAnticipoMotivo = params.data.rhAnticipoMotivo && params.data.rhAnticipoMotivo.rhAnticipoMotivoPK
            && params.data.rhAnticipoMotivo.rhAnticipoMotivoPK.motDetalle ? params.data.rhAnticipoMotivo : null;
          return {
            value: rhAnticipoMotivo,
            name: 'rhAnticipoMotivo',
            obligatorio: true,
            ejecutarMetodoChange: false,
            listValues: contexto.motivosDeAnticipos,
            fieldsShow: ['rhAnticipoMotivoPK.motDetalle']
          }
        },
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (params.data.rhAnticipoMotivo && params.data.rhAnticipoMotivo.rhAnticipoMotivoPK.motDetalle) {
              return false;
            }
            return true;
          }
        }
      },
      {
        headerName: LS.TAG_DESCUENTO,
        field: 'descValor',
        valueFormatter: numberFormatter2,
        suppressKeyboardEvent: (params) => {
          if (params.editing) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.descuentos)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        width: 110,
        minWidth: 110,
        editable: esEditable,
        cellClass: 'text-right',
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (params.data.descValor && params.data.descValor > this.utilService.quitarComasNumero(empleado.empSueldoIess)) {
              return true;
            }
            if (params.data.descValor && params.data.descValor >= 0) {
              return false;
            }
            return true;
          }
        },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'descValor',
          maxlength: 12,
          placeholder: '0.00',
          configAutonumeric: contexto.autonumeric92
        }
      },
      this.utilService.getColumnaOpciones()
    )
    return columnas;
  }

}

function numberFormatter2(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
