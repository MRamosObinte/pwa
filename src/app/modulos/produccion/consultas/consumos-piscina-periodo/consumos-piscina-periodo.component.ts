import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { PrdListaCorridaTO } from '../../../../entidadesTO/Produccion/PrdListaCorridaTO';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { SectorService } from '../../archivos/sector/sector.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ConsumoService } from '../../transacciones/consumo/consumo.service';
import { PiscinaService } from '../../archivos/piscina/piscina.service';
import { ToastrService } from 'ngx-toastr';
import { CorridaService } from '../../archivos/corrida/corrida.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { ConsumosPiscinaPeriodoService } from './consumos-piscina-periodo.service';
import { GridApi } from 'ag-grid';
import { ProductoService } from '../../../inventario/componentes/producto/producto.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';

@Component({
  selector: 'app-consumos-piscina-periodo',
  templateUrl: './consumos-piscina-periodo.component.html',
  styleUrls: ['./consumos-piscina-periodo.component.css']
})
export class ConsumosPiscinaPeriodoComponent implements OnInit {

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
  public fechaActual: Date = new Date();
  public fechaInicioCorrida: Date;
  public fechaFinCorrida: Date;
  public es: object = {};
  public objetoDesdeFuera;// PARA MOSTRAR KARDEX
  public mostrarKardex: boolean = false;// PARA MOSTRAR KARDEX
  public dataListado: any = {};
  public producto: any;
  public mostrarBtnRegresarFomulario: boolean = true;
  //
  public listaSectores: Array<PrdListaSectorTO> = new Array();
  public sectorSeleccionado: PrdListaSectorTO;
  public listaPiscina: Array<PrdListaPiscinaTO> = new Array();
  public piscinaSeleccionado: PrdListaPiscinaTO;
  public listaCorridas: Array<PrdListaCorridaTO> = new Array();
  public corridaSeleccionada: PrdListaCorridaTO;
  public retornoTo: any;
  public listadoConsumosFechaDesglosado: Array<any> = null;
  public columnasDinamicas: Array<any>[];
  public filaSeleccionada: any;
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private sectorService: SectorService,
    private filasService: FilasResolve,
    private consumoService: ConsumoService,
    private piscinaService: PiscinaService,
    private corridaService: CorridaService,
    private consumosPiscinaPeriodoService: ConsumosPiscinaPeriodoService,
    private productoService: ProductoService,
    private sistemaService: AppSistemaService,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['consumosPiscinaPeriodo'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.obtenerFechaInicioActualMes();
    this.generarAtajosTeclado();
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
      this.fechaDesde = null;
      this.fechaActual = null;
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
      this.fechaDesde = null;
      this.fechaHasta = null;
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
      this.seleccionarFechas();
    } else {
      this.listaCorridas = [];
      this.corridaSeleccionada = this.listaCorridas[0];
      this.fechaDesde = null;
      this.fechaHasta = null;
    }
    this.cargando = false;
  }

  seleccionarFechas() {
    this.fechaInicioCorrida = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaDesde);
    this.fechaDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaDesde);
    if (this.corridaSeleccionada) {
      if (this.corridaSeleccionada.corFechaHasta) {
        this.fechaFinCorrida = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaHasta);
        this.fechaHasta = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaHasta);
      } else {
        this.fechaHasta = null;
        this.fechaFinCorrida = null;
      }
    }
  }

  listadoConsumos(form: NgForm) {
    if (this.consumoService.verificarPermiso(LS.ACCION_CONSULTAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          codigoSector: this.sectorSeleccionado.secCodigo,
          numeroPiscina: this.piscinaSeleccionado.pisNumero,
          fechaInicio: this.utilService.formatearDateToStringDDMMYYYY(this.fechaDesde),
          fechaFin: this.fechaHasta ? this.utilService.formatearDateToStringDDMMYYYY(this.fechaHasta) : null,
          periodo: "MENSUAL",
          usuario: this.empresaSeleccionada.empSmtpUserName
        };
        this.filasTiempo.iniciarContador();
        this.consumosPiscinaPeriodoService.listarConsumosPiscinaPeriodo(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeListarConsumosPiscinaPeriodo(data) {
    if (data) {
      if (data.datos[0][0] == "") {
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
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  ejecutarAccion(data) {
    // del boton eliminar de "corrida seleccionada"
    if (data) {
      // kardex
      this.producto = data;
      this.listarKardex();
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
      this.objetoDesdeFuera = {
        empresa: this.empresaSeleccionada,
        bodega: null,
        fechaDesde: this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaHasta ? this.fechaHasta : this.fechaActual),
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
        codigoSector: this.sectorSeleccionado.secCodigo,
        numeroPiscina: this.piscinaSeleccionado.pisNumero,
        codigoCorrida: this.corridaSeleccionada.corNumero,
        periodo: "MENSUAL",
        fechaInicio: this.utilService.formatearDateToStringDDMMYYYY(this.fechaDesde),
        fechaFin: this.fechaHasta ? this.utilService.formatearDateToStringDDMMYYYY(this.fechaHasta) : null,
        numeroLarvas: this.corridaSeleccionada.corNumeroLarvas,
        numeroHectareas: this.corridaSeleccionada.corHectareas,
        columnas: this.columnasDinamicas,
        datos: this.listadoConsumosFechaDesglosado
      };
      this.consumosPiscinaPeriodoService.exportarConsumosPiscinaPeriodo(parametros, this, this.empresaSeleccionada);
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
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

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.consumosPiscinaPeriodoService.generarColumnas(this.columnasDinamicas);
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
}
