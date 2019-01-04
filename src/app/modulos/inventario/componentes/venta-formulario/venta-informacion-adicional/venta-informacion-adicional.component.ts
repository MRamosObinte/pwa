import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvVentasTO } from '../../../../../entidadesTO/inventario/InvVentasTO';
import { LS } from '../../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { ClaveValor } from '../../../../../enums/ClaveValor';
import { InputCellComponent } from '../../../../componentes/input-cell/input-cell.component';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { BotonOpcionesComponent } from '../../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../../componentes/tooltip-reader/tooltip-reader.component';

@Component({
  selector: 'app-venta-informacion-adicional',
  templateUrl: './venta-informacion-adicional.component.html'
})
export class VentaInformacionAdicionalComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() invVentasTO: InvVentasTO;
  @Input() puedeEditar: boolean;
  @Input() listaIA: Array<ClaveValor> = new Array();

  constantes: any = LS;
  iaSseleccionado: ClaveValor;
  indiceSeleccionado: number;

  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public rowSelection: string;
  public context;

  public isScreamMd: boolean = true; //pantalla pequeña o grande

  constructor(
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.iniciarAgGrid();
    this.formatearIA();
  }

  formatearIA() {
    if (this.invVentasTO && this.invVentasTO.vtaInformacionAdicional) {
      let lista: Array<String> = this.invVentasTO.vtaInformacionAdicional.split("|");
      if (lista != null) {
        for (let i = 0; i < lista.length; i++) {
          let objeto: Array<String> = lista[i].split("=");
          if (objeto != null && objeto.length > 1) {
            let nuevoItem: ClaveValor = new ClaveValor();
            nuevoItem.clave = objeto[0] + "";
            nuevoItem.valor = objeto[1] + "";
            this.listaIA.push(nuevoItem);
          }
        }
      }
    }
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.generarColumnas();
    this.rowSelection = "single";
    this.context = { componentParent: this };
  };

  generarColumnas(): Array<any> {
    let columnas: Array<any> = [];
    /**EDITANDO O CREANDO */
    columnas.push(
      {
        headerName: LS.TAG_ATRIBUTO,
        field: 'clave',
        width: 50,
        minWidth: 50,
        cellClass: "text-uppercase",
        cellClassRules: {
          "cell-with-errors": (params) => {
            return (!params.data.clave && params.data.valor) || (!params.data.clave && !params.data.valor);
          }
        },
        suppressKeyboardEvent: (params) => {
          switch (params.event.keyCode) {//elegir accion de acuerdo a la tecla presionada
            case LS.KEYCODE_TAB:
              this.valorFocusAndEditingCell(params.node.rowIndex);
              break;
            case LS.KEYCODE_DOWN:
            case LS.KEYCODE_UP:
              if (params.editing) { return this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, this.listaIA) }
              break;
            default:
              return true;
          }
        },
        editable: this.puedeEditar,
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'clave',
          maxlength: 150,
          inputClass: 'text-uppercase',
          placeholder: ''
        }
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'valor',
        width: 100,
        minWidth: 100,
        cellClass: "text-uppercase",
        cellClassRules: {
          "cell-with-errors": (params) => {
            return (params.data.clave && !params.data.valor) || (!params.data.clave && !params.data.valor);
          }
        },
        editable: this.puedeEditar,
        suppressKeyboardEvent: (params) => {
          switch (params.event.keyCode) {//elegir accion de acuerdo a la tecla presionada
            case LS.KEYCODE_DOWN:
            case LS.KEYCODE_UP:
              if (params.editing) { return this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, this.listaIA) }
              break;
            default:
              return true;
          }
        },
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'valor',
          inputClass: 'text-uppercase mousetrap',
        }
      }
    );
    if (this.puedeEditar) {
      columnas.push(
        {
          headerName: LS.TAG_OPCIONES,
          headerClass: 'cell-header-center',//Clase a nivel de th
          cellClass: 'text-center',
          width: 20,
          minWidth: 20,
          cellRendererFramework: BotonOpcionesComponent,
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: LS.ICON_OPCIONES,
            tooltip: LS.TAG_OPCIONES,
            text: '',
            enableSorting: false
          }
        }
      )
    }
    return columnas;
  }

  generarOpciones() {
    this.opciones = [
      { label: LS.ACCION_AGREGAR_FILA, icon: LS.ICON_FLECHA_ABAJO, command: () => this.agregarFila() },
      { label: LS.ACCION_ELIMINAR_FILA, icon: LS.ICON_ELIMINAR, command: () => this.eliminarFila() },
    ];
  }

  eliminarFila() {
    let listaTemporal = this.listaIA.slice();
    listaTemporal.splice(this.indiceSeleccionado, 1);
    this.listaIA = listaTemporal;
    this.refreshGrid();
  }

  agregarFila() {
    var nuevoItem = new ClaveValor();
    this.listaIA.push(nuevoItem);
    let longitud = this.listaIA.length;
    setTimeout(() => {
      this.gridApi.setFocusedCell(longitud - 1, 'clave')
      this.gridApi.startEditingCell({ rowIndex: longitud - 1, colKey: "clave" });
    }, 50);
    this.gridApi ? this.gridApi.updateRowData({ add: [nuevoItem] }) : null;
  }

  valorFocusAndEditingCell(index) {
    this.gridApi.setFocusedCell(index, "valor");
    this.gridApi.startEditingCell({ rowIndex: index, colKey: "valor" });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.redimensionarColumnas();
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
  }

  filaFocused(event) {
    this.indiceSeleccionado = event.rowIndex;
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    let columna = filasFocusedCell ? filasFocusedCell.column : null;
    if (columna && columna.getColDef().editable) {
      this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
    }
    this.iaSseleccionado = fila ? fila.data : null;
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    if (this.puedeEditar) {
      this.iaSseleccionado = data;
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }
  //#endregion

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }
}