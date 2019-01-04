import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { PrdListaCorridaTO } from '../../../../entidadesTO/Produccion/PrdListaCorridaTO';
import { MultiplePiscinaCorrida } from '../../../../entidadesTO/Produccion/MultiplePiscinaCorrida';
import { GridApi } from 'ag-grid';
import * as moment from 'moment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { SectorService } from '../../archivos/sector/sector.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ConsumoService } from '../../transacciones/consumo/consumo.service';
import { PiscinaService } from '../../archivos/piscina/piscina.service';
import { CorridaService } from '../../archivos/corrida/corrida.service';
import { CostosPiscinaMultipleService } from './costos-piscina-multiple.service';
import { ProductoService } from '../../../inventario/componentes/producto/producto.service';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { NgForm } from '@angular/forms';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ContextMenu } from 'primeng/contextmenu';

@Component({
  selector: 'app-costos-piscina-multiple',
  templateUrl: './costos-piscina-multiple.component.html',
  styleUrls: ['./costos-piscina-multiple.component.css']
})
export class CostosPiscinaMultipleComponent implements OnInit {

  @Input() isModal: boolean;
  @Input() parametrosBusqueda;
  @ViewChild("excelDownload") excelDownload;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public accion: string = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  public classIcon: string = LS.ICON_FILTRAR;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  public opciones: MenuItem[];
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public es: object = {};
  //
  public listaSectores: Array<PrdListaSectorTO> = new Array();
  public sectorSeleccionado: PrdListaSectorTO;
  public listaPiscina: Array<PrdListaPiscinaTO> = new Array();
  public piscinaSeleccionado: PrdListaPiscinaTO;
  public listaCorridas: Array<PrdListaCorridaTO> = new Array();
  public corridaSeleccionada: PrdListaCorridaTO;
  public listaCostoPiscinaMultiple: Array<MultiplePiscinaCorrida> = new Array();
  public multiplePiscinaCorrida: MultiplePiscinaCorrida;
  public empresaAsignada: PermisosEmpresaMenuTO;
  public retornoTo: any;
  public listadoConsumosFechaDesglosado: Array<any> = null;
  public columnasDinamicas: Array<any>[];
  //Datos de la tabla: piscinas seleccionadas
  public filaSeleccionada: any;
  // 
  public objetoDesdeFuera;// PARA MOSTRAR KARDEX
  public mostrarKardex: boolean = false;// PARA MOSTRAR KARDEX
  public dataListado: any = {};
  public producto: any;
  public mostrarBtnRegresarFomulario: boolean = true;
  //AG-GRID Costo por piscina multiple
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  //AG-GRID MultiplePiscinaCorrida
  public _gridApi: GridApi;
  public _gridColumnApi: any;
  public _columnDefs: Array<object> = [];
  public _columnDefsSelected: Array<object> = [];
  public _rowSelection: string;
  public _context;
  public frameworkComponents: any;

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private sectorService: SectorService,
    private filasService: FilasResolve,
    private consumoService: ConsumoService,
    private piscinaService: PiscinaService,
    private corridaService: CorridaService,
    private consumoPiscinaMultipleService: CostosPiscinaMultipleService,
    private productoService: ProductoService,
    private sistemaService: AppSistemaService,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['costosPiscinaMultiple'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.sectorSeleccionado = new PrdListaSectorTO();
    this.piscinaSeleccionado = new PrdListaPiscinaTO();
    this.corridaSeleccionada = new PrdListaCorridaTO();
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.empresaAsignada = new PermisosEmpresaMenuTO();
    this.generarAtajosTeclado();
    this.obtenerFechaInicioActualMes();
    this._iniciarAgGrid();
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listarSectores();
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.listadoConsumosFechaDesglosado = null;
    this.filasService.actualizarFilas("0", "0");
  }

  listarSectores() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      mostrarInactivo: false
    }
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.cargando = false;
    if (data.length > 0) {
      this.listaSectores = data;
      this.sectorSeleccionado = this.listaSectores ? this.listaSectores[0] : undefined;
      if (this.sectorSeleccionado) {
        this.listarPiscinas();
      }
    } else {
      this.listaSectores = [];
      this.listaPiscina = [];
      this.listaCorridas = [];
      this.sectorSeleccionado = this.listaSectores[0];
      this.piscinaSeleccionado = this.listaPiscina[0];
      this.corridaSeleccionada = this.listaCorridas[0];
    }
  }

  listarPiscinas() {
    if (this.piscinaService.verificarPermiso(LS.ACCION_CONSULTAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado.secCodigo,
        mostrarInactivo: false,
      };
      this.piscinaService.listarPrdListaPiscinaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeListarPiscina(data) {
    if (data.length > 0) {
      this.listaPiscina = data;
      this.piscinaSeleccionado = this.listaPiscina ? this.listaPiscina[0] : null;
      if (this.piscinaSeleccionado) {
        this.listarCorridas();
      }
    } else {
      this.listaPiscina = [];
      this.listaCorridas = [];
      this.piscinaSeleccionado = this.listaPiscina[0];
      this.corridaSeleccionada = this.listaCorridas[0];
    }
    this.cargando = false;
  }

  listarCorridas() {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado.secCodigo,
        piscina: this.piscinaSeleccionado.pisNumero,
        mostrarInactivo: false,
      };
      this.corridaService.listarPrdListaCorridaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeListarCorrida(data) {
    if (data.length > 0) {
      this.listaCorridas = data;
      this.corridaSeleccionada = this.listaCorridas ? this.listaCorridas[0] : null;
    } else {
      this.listaCorridas = [];
      this.corridaSeleccionada = this.listaCorridas[0];
    }
    this.cargando = false;
  }

  listadoCostos(form: NgForm, agrupadoPor) {
    if (this.consumoService.verificarPermiso(LS.ACCION_CONSULTAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          multiplePiscinaCorrida: this.listaCostoPiscinaMultiple,
          proceso: "COSTO",
          agrupadoPor: agrupadoPor,
        };
        this.filasTiempo.iniciarContador();
        this.consumoPiscinaMultipleService.listarCostosPiscinaMultiple(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesListarCostosPiscinaMultiple(data) {
    if (data) {
      if (data.datos[0][0] === " " || data.datos[0][0] === "") {
        data.datos.shift();
      }
      this.retornoTo = data;
      this.listadoConsumosFechaDesglosado = data.datos;
      this.columnasDinamicas = data.columnas;
    }
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
    this.refreshGrid();
    this.filtrarRapido();
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        // this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  ejecutarAccion(data) {
    // del boton eliminar de "corrida seleccionada"
    if (data) {
      // kardex
      this.producto = data;
      this.listarKardex();
    } else {
      // eliminar corrida seleccionada
      var indexTemp = this.listaCostoPiscinaMultiple.findIndex(item => item.corrida === this.multiplePiscinaCorrida.corrida);
      this.listaCostoPiscinaMultiple = this.listaCostoPiscinaMultiple.filter((val, i) => i != indexTemp);
      if (this.listadoConsumosFechaDesglosado) {
        this.limpiarResultado();
      }
      this._refreshGrid();
    }
  }

  consultarKardex() {
    this.producto = this.filaSeleccionada;
    if (this.producto[1] !== "") {
      this.listarKardex();
    }
  }

  listarKardex() {
    if (this.producto) {
      this.dataListado = { vista: 'kardex', nombreProducto: this.producto[0] };
      let desde = new Date(this.utilService.obtenerFechaInicioMes());
      desde.setMonth(desde.getMonth() - 1);
      this.objetoDesdeFuera = {
        empresa: this.empresaSeleccionada,
        bodega: null,
        fechaDesde: this.utilService.formatoDateSinZonaHorariaYYYMMDD(desde),
        fechaHasta: this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaHasta),
        productoSeleccionado: null
      }
      this.obtenerInvProductoTO();
    }
  }

  obtenerInvProductoTO() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      codigo: this.producto[1] ? this.producto[1] : ""
    }
    // Es el codigo del producto: this.producto[1]
    this.productoService.obtenerProducto(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerProducto(data) {
    this.objetoDesdeFuera.productoSeleccionado = data ? new InvListaProductosGeneralTO() : null;
    this.objetoDesdeFuera.productoSeleccionado.proCodigoPrincipal = data ? data.proCodigoPrincipal : null;
    this.objetoDesdeFuera.productoSeleccionado.proCategoria = data ? data.catCodigo : null;
    this.objetoDesdeFuera.productoSeleccionado.proNombre = data ? data.proNombre : null;
    this.objetoDesdeFuera.productoSeleccionado.detalleMedida = data ? data.medCodigo : null;
    this.cargando = false;
    this.objetoDesdeFuera = data ? this.objetoDesdeFuera : null;
    this.mostrarKardex = data ? true : false;
  }

  cerrarKardex(event) {
    this.mostrarKardex = event;
    this.objetoDesdeFuera = null;
    this.generarAtajosTeclado();
  }

  verEstadoBtnRegresar(event) {
    this.mostrarBtnRegresarFomulario = event;
    if (this.mostrarBtnRegresarFomulario) {
      this.objetoDesdeFuera = null;
      this.mostrarKardex = false;
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        columnas: this.columnasDinamicas,
        datos: this.listadoConsumosFechaDesglosado
      };
      this.consumoPiscinaMultipleService.exportarCostosPiscinaMultiple(parametros, this, this.empresaSeleccionada);
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnAgregar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnLimpiar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  generarOpciones(seleccionado) {
    let perConsultar = seleccionado[1];
    this.opciones = [
      {
        label: LS.ACCION_VER_KARDEX,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar[1] ? this.visualizarKardex() : null
      }
    ];
  }

  visualizarKardex() {
    this.producto = this.filaSeleccionada;
    this.listarKardex();
  }

  //boton agregar
  agregarMultiplePiscinaCorrida() {
    if (this.empresaAsignada.empCodigo === "") {
      this.empresaAsignada = this.empresaSeleccionada;
    }
    if (this.empresaSeleccionada.empCodigo === this.empresaAsignada.empCodigo) {
      if (!this.listaCostoPiscinaMultiple.find(item => item.corrida === (this.corridaSeleccionada ? this.corridaSeleccionada.corNumero : ''))) {
        this.accion = LS.ACCION_ELIMINAR;
        let atributos = {
          sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
          piscina: this.piscinaSeleccionado ? this.piscinaSeleccionado.pisNumero : '',
          corrida: this.corridaSeleccionada ? this.corridaSeleccionada.corNumero : '',
          desde: this.corridaSeleccionada ? this.corridaSeleccionada.corFechaDesde : '',
          hasta: this.corridaSeleccionada ? this.corridaSeleccionada.corFechaHasta : ''
        };
        let multiplePiscinaCorrida: MultiplePiscinaCorrida = new MultiplePiscinaCorrida(atributos);
        let listaTemporal = [... this.listaCostoPiscinaMultiple];
        listaTemporal.unshift(multiplePiscinaCorrida);
        this.listaCostoPiscinaMultiple = listaTemporal;
        this._refreshGrid();
      } else {
        this.toastr.warning(LS.MSJ_CORRIDA_AGREGADA, LS.TAG_AVISO);
      }
    } else {
      this.toastr.warning(LS.MSJ_CORRIDA_MISMA_EMPRESA, LS.TAG_AVISO);
    }
  }

  limpiarCorridasSeleccionadas() {
    this.listaCostoPiscinaMultiple = [];
    this.empresaAsignada = new PermisosEmpresaMenuTO();
    this.limpiarResultado();
    this._refreshGrid();
  }

  //#region [AG-GRID] Tabla costos por piscina multiple
  iniciarAgGrid() {
    this.columnDefs = this.consumoPiscinaMultipleService.generarColumnas(this.columnasDinamicas);
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
    this.context = { componentParent: this };
    this.components = {};
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.filaSeleccionada = data;
    this.generarOpciones(this.filaSeleccionada); // piscinaSeleccionada (no estaba)
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.filaSeleccionada = fila ? fila.data : null;
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = this.innerWidth <= 576 ? false : true; this.isScreamMd = this.innerWidth <= 576 ? false : true;
  }

  //Tabla lista MultiplePiscinaCorrida
  _iniciarAgGrid() {
    this._columnDefs = this.consumoPiscinaMultipleService.generarColumnasPiscinasSeleccionadas(this);
    this._columnDefsSelected = this._columnDefs.slice();
    this._rowSelection = "single";
    this._context = { componentParent: this };
    this.frameworkComponents = {
      inputEstado: InputEstadoComponent,
      botonOpciones: BotonOpcionesComponent,
    };
  }

  _onGridReady(params) {
    this._gridApi = params.api;
    this._gridColumnApi = params.columnApi;
    // this._actualizarFilas();
    this._redimencionarColumnas();
    this._seleccionarPrimerFila();
  }

  _seleccionarPrimerFila() {
    if (this._gridApi) {
      var firstCol = this._gridColumnApi.getAllDisplayedColumns()[0];
      this._gridApi.setFocusedCell(0, firstCol);
    }
  }

  _redimencionarColumnas() {
    this._gridApi ? this._gridApi.sizeColumnsToFit() : null;
  }

  _refreshGrid() {
    this._gridApi ? this._gridApi.refreshCells() : null;
    // setTimeout(() => { this._actualizarFilas(); }, 50);
  }

  _filaFocused(event) {
    let fila = this._gridApi ? this._gridApi.getRowNode(event.rowIndex) : null;
    this.multiplePiscinaCorrida = fila ? fila.data : null;
  }
}
