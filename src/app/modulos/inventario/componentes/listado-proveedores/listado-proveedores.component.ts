import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ProveedorService } from '../../archivo/proveedor/proveedor.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InvProveedorTO } from '../../../../entidadesTO/inventario/InvProveedorTO';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { MenuItem } from 'primeng/api';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Component({
  selector: 'app-listado-proveedores',
  templateUrl: './listado-proveedores.component.html',
  styleUrls: ['./listado-proveedores.component.css']
})
export class ListadoProveedoresComponent implements OnInit {

  @Input() parametrosBusqueda: any = null; //Parametro de busqueda de tipo {empresa: '', categoria: '', inactivos: false, busqueda: ''}
  public listaResultado: Array<InvProveedorTO>; //Lista que aparecerá en la tabla
  public objectSelect: InvProveedorTO; //Objeto actualmente seleccionado
  public constantes: any;
  public isScreamMd: boolean;//Identifica si la pantalla es tamaño MD
  public cargando: boolean = false;
  public enterKey: number = 0;//Suma el numero de enter
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public gridApi: GridApi;
  public opciones: MenuItem[];
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";

  constructor(
    public activeModal: NgbActiveModal,
    private proveedorService: ProveedorService,
    private utilService: UtilService
  ) {
    this.listaResultado = [];
    this.objectSelect = new InvProveedorTO();
    this.constantes = LS;
  }

  ngOnInit() {
    this.iniciarAgGrid();
    this.isScreamMd = window.innerWidth <= 576 ? false : true;//Determina si la pantalla es >=md o xs
    if (this.parametrosBusqueda) {
      this.buscarProveedor();
    }
  }

  buscarProveedor() {
    this.limpiarResultado();
    this.cargando = true;
    this.proveedorService.listarInvProveedorTO(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvProveedorTO(data) {
    this.listaResultado = data;
    this.cargando = false;
    if (this.listaResultado.length === 0) {
      this.activeModal.close(null);
    } else {
      if (this.listaResultado.length === 1) {
        this.enviarItem(this.listaResultado[0]);
      }
    }
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.objectSelect = new InvProveedorTO();
  }

  ejecutarSpanAccion(event, data) {
    this.enviarItem(data);
  }

  enviarItem(item) {
    this.activeModal.close(item);
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'provCodigo',
        width: 150
      },
      {
        headerName: LS.TAG_RAZON_SOCIAL,
        field: 'provRazonSocial',
        width: 600
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'provNombreComercial',
        width: 600
      },
      this.utilService.getSpanSelect()
    ];
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      toolTip: TooltipReaderComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
  }

  /*Metodos para seleccionar producto con ENTER O DOBLECLICK */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      if (this.enterKey > 0) {
        this.enviarItem(this.objectSelect);
      }
      this.enterKey = this.enterKey + 1;
    }
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objectSelect = fila ? fila.data : null;
  }

  filaSeleccionar() {
    this.enviarItem(this.objectSelect);
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      // scrolls to the first column
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      // sets focus into the first grid cell
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }
  //#endregion
}
