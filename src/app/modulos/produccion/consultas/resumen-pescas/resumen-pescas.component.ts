import { InvListaProductosGeneralTO } from './../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { PrdListaCostosDetalleCorridaTO } from './../../../../entidadesTO/Produccion/PrdListaCostosDetalleCorridaTO';
import { ProductoService } from './../../../inventario/componentes/producto/producto.service';
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { PrdListaCorridaTO } from '../../../../entidadesTO/Produccion/PrdListaCorridaTO';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { NgForm } from '@angular/forms';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { SectorService } from '../../archivos/sector/sector.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ActivatedRoute } from '@angular/router';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdResumenCorridaTO } from '../../../../entidadesTO/Produccion/PrdResumenCorridaTO';
import { ContextMenu } from 'primeng/contextmenu';
import * as moment from 'moment';
import { ResumenPescasService } from './resumen-pescas.service';

@Component({
  selector: 'app-resumen-pescas',
  templateUrl: './resumen-pescas.component.html',
  styleUrls: ['./resumen-pescas.component.css']
})
export class ResumenPescasComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaResultadoResumenPescaSiembra: Array<PrdResumenCorridaTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public resumenPescaSiembraSeleccionado: PrdResumenCorridaTO = new PrdResumenCorridaTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public fechaInicio: Date;
  public fechaFin: Date;
  public opciones: MenuItem[];
  public es: object = {};
  public mostrarCostoPiscina: boolean = false;
  public verDetalle: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  //COSTO POR PISICINA
  public parametrosBusqueda: any = null;
  //Para Kardex
  public objetoDesdeFuera;
  public productoSeleccionado: PrdListaCostosDetalleCorridaTO;
  public mostrarKardex: boolean = false;
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public screamXS: boolean = true;
  public filtroGlobal = "";
  public frameworkComponents;
  // Grafico
  view = [window.innerWidth - 100, 380];
  colorScheme = { domain: ['#416273', '#8f9ba6', '#C7B42C', '#AAAAAA'] };
  data: any;

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private sistemaService: AppSistemaService,
    private sectorService: SectorService,
    private toastr: ToastrService,
    private productoService: ProductoService,
    private resumenPescaService: ResumenPescasService
  ) {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['resumenPesca'];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtgajosTeclado();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.consultarFechaMaxMinPesca();
    this.listarSectores();
    this.limpiarResultado();
  }

  generarAtgajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarResumenPesca') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarResumenPesca') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarResumenPesca') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirResumenPesca') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  obtenerFechaInicioFinMes() {
    this.sistemaService.getFechaInicioFinMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
        this.fechaFin = data[1];//Fecha fin esta en la posicion 1
      }).catch(err => this.utilService.handleError(err, this));
  }

  consultarFechaMaxMinPesca() {
    this.cargando = true;
    this.resumenPescaService.consultarFechaMaxMinPesca({ empresa: this.empresaSeleccionada.empCodigo }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeconsultarFechaMaxMinPesca(data) {
    this.cargando = false;
    if (data) {
      this.fechaInicio = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data.fechaDesde);
      this.fechaFin = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data.fechaHasta);
    } else {
      this.obtenerFechaInicioFinMes();
    }
  }

  generarOpciones() {
    let permiso = this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this);
    this.opciones = [
      { label: LS.ACCION_VISUALIZAR_DETALLE, icon: LS.ICON_CONSULTAR, disabled: !permiso, command: () => permiso ? this.consultarDetalle() : null },
      { label: LS.ACCION_VISUALIZAR_COSTO_PISCINA, icon: LS.ICON_EXTERNAL, disabled: !permiso, command: () => permiso ? this.consultarCostoPorPiscina() : null },
    ];
  }

  limpiarResultado() {
    this.listaResultadoResumenPescaSiembra = [];
    this.filasService.actualizarFilas(0, 0);
    this.data = null;
  }

  listarSectores() {
    this.limpiarResultado();
    this.listaSectores = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listaSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  //Operaciones
  buscarResumenPesca(form: NgForm) {
    this.cargando = true;
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    this.filasTiempo.iniciarContador();
    if (formularioTocado && form && form.valid) {
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        codigoSector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        fechaInicio: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        fechaFin: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
        tipoResumen: 'PESCA'
      };
      this.resumenPescaService.listarResumenCorrida(parametro, this, LS.KEY_EMPRESA_SELECT)
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarResumenCorrida(data) {
    this.listaResultadoResumenPescaSiembra = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
    //Grafico
    this.data = this.resumenPescaService.convertirGrafico(this.listaResultadoResumenPescaSiembra);
  }

  imprimirResumenPesca() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        listaPrdListaResumenCorridaTO: this.listaResultadoResumenPescaSiembra
      };
      this.resumenPescaService.imprimirResumenPesca(parametros, this, this.empresaSeleccionada)
    }
  }

  exportarResumenPesca() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
        listado: this.listaResultadoResumenPescaSiembra
      };
      this.resumenPescaService.exportarResumenPesca(parametros, this, this.empresaSeleccionada)
    }
  }

  consultarDetalle() {
    if (this.resumenPescaSiembraSeleccionado.pisNumero) {
      this.verDetalle = true;
    }
  }

  consultarCostoPorPiscina() {
    this.parametrosBusqueda = null;
    if (this.resumenPescaSiembraSeleccionado.pisNumero) {
      let sector = new PrdListaSectorTO();
      sector.secCodigo = this.resumenPescaSiembraSeleccionado.secCodigo;
      let piscina = new PrdListaPiscinaTO();
      piscina.pisNumero = this.resumenPescaSiembraSeleccionado.pisNumero;
      let corrida = new PrdListaCorridaTO();
      corrida.corNumero = this.resumenPescaSiembraSeleccionado.rcCorridaNumero;
      corrida.corHectareas = this.resumenPescaSiembraSeleccionado.rcResultadoHectarea;
      this.parametrosBusqueda = {
        parametros: {
          empresa: this.empresaSeleccionada.empCodigo,
          sector: this.resumenPescaSiembraSeleccionado.secCodigo,
          piscina: this.resumenPescaSiembraSeleccionado.pisNumero,
          desde: "'" + this.resumenPescaSiembraSeleccionado.rcFechaDesde + "'",
          hasta: this.resumenPescaSiembraSeleccionado.rcFechaHasta ? "'" + this.resumenPescaSiembraSeleccionado.rcFechaHasta + "'" : null,
          agrupadoPor: 'CATEGORIA'
        },
        empresaSeleccionada: this.empresaSeleccionada,
        sectorSeleccionado: sector,
        piscinaSeleccionado: piscina,
        corridaSeleccionada: corrida,
        btnRegresar: true,
        estilos: { 'width': '100%', 'height': 'calc(100vh - 490px)' }
      }
      this.mostrarCostoPiscina = true;
    }
  }
  //Kardex
  consultarKardex(event) {
    this.productoSeleccionado = event;
    if (this.productoSeleccionado && this.productoSeleccionado.costoCodigo) {
      this.objetoDesdeFuera = {
        empresa: this.empresaSeleccionada,
        bodega: null,
        fechaDesde: this.fechaInicio,
        fechaHasta: this.fechaFin,
        productoSeleccionado: null
      }
      this.obtenerInvProductoTO();
    }
  }

  obtenerInvProductoTO() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      codigo: this.productoSeleccionado.costoCodigo ? this.productoSeleccionado.costoCodigo : ""
    }
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
    this.mostrarKardex = true;
  }

  cerrarKardex(event) {
    this.productoSeleccionado = null;
    this.mostrarKardex = false;
    this.objetoDesdeFuera = null;
    this.generarAtgajosTeclado();
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.resumenPescaService.generarColumnas();
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

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.resumenPescaSiembraSeleccionado = fila ? fila.data : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  ejecutarAccion(data) {
    this.resumenPescaSiembraSeleccionado = data;
    this.consultarDetalle();
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.resumenPescaSiembraSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.view = [event.target.innerWidth - 100, 280];
  }

}
