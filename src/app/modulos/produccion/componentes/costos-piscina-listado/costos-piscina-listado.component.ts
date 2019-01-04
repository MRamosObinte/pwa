import { Component, OnInit, Input, HostListener, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { CostosPiscinaService } from '../../consultas/costos-piscina/costos-piscina.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { LS } from '../../../../constantes/app-constants';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { PrdListaCostosDetalleCorridaTO } from '../../../../entidadesTO/Produccion/PrdListaCostosDetalleCorridaTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-costos-piscina-listado',
  templateUrl: './costos-piscina-listado.component.html',
  styleUrls: ['./costos-piscina-listado.component.css']
})
export class CostosPiscinaListadoComponent implements OnInit, OnChanges {
  public listaResultado: Array<PrdListaCostosDetalleCorridaTO> = [];
  public screamXS: boolean = true;
  public estilos: any = {};
  public constantes: any = {};
  public activarCostoPiscina: boolean = false;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() parametroBusqueda;
  @Output() cargando = new EventEmitter();
  @Output() cerrarListado = new EventEmitter();
  @Output() activar = new EventEmitter();
  @Output() seObtuvoProducto = new EventEmitter();
  //
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";
  public filasTiempo: FilasTiempo = new FilasTiempo();

  //
  public producto: PrdListaCostosDetalleCorridaTO;
  public filaSeleccionada: any;
  public costoSeleccionado: PrdListaCostosDetalleCorridaTO;

  constructor(
    private utilService: UtilService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private costosPiscinaService: CostosPiscinaService
  ) {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.constantes = LS;
  }

  ngOnInit() {
    this.generarAtajosTeclado();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.parametroBusqueda) {
      this.estilos = this.parametroBusqueda.estilos;
      this.empresaSeleccionada = this.parametroBusqueda.empresaSeleccionada;
      this.buscarCostoPiscina();
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarActivar() {
    this.activarCostoPiscina = !this.activarCostoPiscina;
    this.activar.emit(this.activarCostoPiscina);
  }

  cambiarCargando() {
    this.cargando.emit(false);
  }

  //Operaciones
  buscarCostoPiscina() {
    this.cargando.emit(true);
    this.filasTiempo.iniciarContador();
    this.costosPiscinaService.listarCostosPiscina(this.parametroBusqueda.parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarCostosPiscina(lista) {
    this.filasTiempo.finalizarContador();
    this.cargando.emit(false);
    this.listaResultado = lista;
    this.iniciarAgGrid();
    if (this.listaResultado.length === 0) {
      this.cerrarListado.emit(null);
    }
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando.emit(true);
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        codigoSector: this.parametroBusqueda.sectorSeleccionado.secCodigo,
        codigoPiscina: this.parametroBusqueda.piscinaSeleccionado.pisNumero,
        codigoCorrida: this.parametroBusqueda.corridaSeleccionada.corNumero,
        hectareas: this.parametroBusqueda.corridaSeleccionada.corHectareas,
        numLarvas: this.parametroBusqueda.corridaSeleccionada.corNumeroLarvas,
        fechaDesde: this.parametroBusqueda.parametros.desde,
        fechaHasta: this.parametroBusqueda.parametros.hasta,
        prdListaCostosDetalleCorridaTO: this.parametroBusqueda.listaResultado
      };
      this.costosPiscinaService.imprimirCostosPiscina(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando.emit(true);
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        codigoSector: this.parametroBusqueda.sectorSeleccionado.secCodigo,
        codigoPiscina: this.parametroBusqueda.piscinaSeleccionado.pisNumero,
        codigoCorrida: this.parametroBusqueda.corridaSeleccionada.corNumero,
        hectareas: this.parametroBusqueda.corridaSeleccionada.corHectareas,
        numLarvas: this.parametroBusqueda.corridaSeleccionada.corNumeroLarvas,
        fechaDesde: this.parametroBusqueda.parametros.desde,
        fechaHasta: this.parametroBusqueda.parametros.hasta,
        prdListaCostosDetalleCorridaTO: this.parametroBusqueda.listaResultado
      };
      this.costosPiscinaService.exportarCostosPiscina(parametros, this, this.empresaSeleccionada);
    }
  }

  regresar() {
    this.cargando.emit(false);
    this.cerrarListado.emit(null);
  }

  consultarKardex() {
    this.producto = this.costoSeleccionado;
    if (this.producto.costoCodigo) {
      this.seObtuvoProducto.emit(this.producto);
    }
    this.producto = null;
  }

  ejecutarAccion(data) {
    this.seObtuvoProducto.emit(data);
  }

  generarOpciones() {
    this.opciones = [
      { label: LS.MSJ_CONSULTAR_KARDEX, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.consultarKardex() },
    ];
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.costosPiscinaService.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.components = {};
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.filaSeleccionada = fila ? fila.data : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.filaSeleccionada = data;
    if (this.filaSeleccionada.costoCodigo !== null) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

}
