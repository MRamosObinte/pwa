import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { ToastrService } from 'ngx-toastr';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ComprasConsolidadoProductosMensualService } from './compras-consolidado-productos-mensual.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { ProductoService } from '../../componentes/producto/producto.service';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';
import { BodegaService } from '../../archivo/bodega/bodega.service';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';

@Component({
  selector: 'app-compras-consolidado-productos-mensual',
  templateUrl: './compras-consolidado-productos-mensual.component.html',
  styleUrls: ['./compras-consolidado-productos-mensual.component.css']
})
export class ComprasConsolidadoProductosMensualComponent implements OnInit {
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaBodegas: Array<InvListaBodegasTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public bodegaSeleccionada: InvListaBodegasTO = new InvListaBodegasTO();
  public comprasConsProductoMenSeleccionado: object;
  public constantes: any = LS;
  public es: object = {};
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public listaResultado: Array<object> = [];
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  public datos: object[][];//para Reportes
  public columnas: Array<string> = [];//para Reportes
  public columnasFaltantes: Array<string> = [];//para Reportes
  public objetoDesdeFuera;// PARA MOSTRAR KARDEX
  public mostrarKardex: boolean = false;;// PARA MOSTRAR KARDEX
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public screamXS: boolean = true;
  //
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];

  constructor(
    private toastr: ToastrService,
    private utilService: UtilService,
    private sectorService: SectorService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private archivoService: ArchivoService,
    private sistemaService: AppSistemaService,
    private productoService: ProductoService,
    private bodegaService: BodegaService,
    private comprasConsProdMensualService: ComprasConsolidadoProductosMensualService
  ) {
    moment.locale('es');
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
  }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data["comprasConsolProductosMensual"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.obtenerFechaInicioActualMes();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.bodegaSeleccionada = null;
    this.limpiarResultado();
    this.listarSectores();
    this.listarBodegas();
  }

  limpiarResultado() {
    this.datos = [];
    this.gridApi = null;
    this.gridColumnApi = null;
    this.listaResultado = [];
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  listarSectores() {
    this.cargando = true;
    this.limpiarResultado();
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = (this.sectorSeleccionado && this.sectorSeleccionado.secCodigo) ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : null;
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  listarBodegas() {
    this.cargando = true;
    this.listaBodegas = [];
    this.limpiarResultado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivo: false };
    this.bodegaService.listarInvListaBodegasTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvListaBodegasTO(data) {
    this.listaBodegas = data;
    if (this.listaBodegas.length > 0) {
      this.bodegaSeleccionada = this.bodegaSeleccionada && this.bodegaSeleccionada.bodCodigo ? this.listaBodegas.find(item => item.bodCodigo === this.bodegaSeleccionada.bodCodigo) : null;
    } else {
      this.bodegaSeleccionada = null;
    }
    this.cargando = false;
  }

  //kardex
  ejecutarAccion(data) {
    this.comprasConsProductoMenSeleccionado = data;
    this.consultarKardex();
  }

  consultarKardex() {
    if (this.comprasConsProductoMenSeleccionado && this.comprasConsProductoMenSeleccionado['1']) {
      this.objetoDesdeFuera = {
        empresa: this.empresaSeleccionada,
        bodega: this.bodegaSeleccionada && this.bodegaSeleccionada.bodCodigo ? this.bodegaSeleccionada : null,
        fechaDesde: this.fechaDesde,
        fechaHasta: this.fechaHasta,
        productoSeleccionado: null
      }
      this.obtenerInvProductoTO();
    }
  }

  obtenerInvProductoTO() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      codigo: this.comprasConsProductoMenSeleccionado['1'] ? this.comprasConsProductoMenSeleccionado['1'] : ""
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
    this.mostrarKardex = data ? true : false;
  }

  cerrarKardex(event) {
    this.mostrarKardex = event;
    this.objetoDesdeFuera = null;
    this.generarAtajosTeclado();
  }

  //Operaciones
  buscarComprasConsProdMensual(cantidades, form: NgForm) {
    this.limpiarResultado();
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        fechaInicio: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaFin: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        codigoSector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
        chk: cantidades
      };
      this.filasTiempo.iniciarContador();
      this.comprasConsProdMensualService.listarComprasPorPeriodo(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarComprasPorPeriodo(data) {
    this.filasTiempo.finalizarContador();
    this.datos = data ? data.datos : [];
    this.columnasFaltantes = data ? data.columnasFaltantes : [];
    if (data) {
      this.columnas = data.columnas ? data.columnas : [];
      this.columnDefs = this.comprasConsProdMensualService.convertirCabeceraObjetoConEstilo(data.columnas ? data.columnas : []);
      this.listaResultado = data ? data.listado : [];
      this.iniciarAgGrid();
    }
    this.cargando = false;
  }

  exportarComprasConsProdMensual() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteComprasPorPeriodo", { datos: this.datos, columnas: this.columnas, columnasFaltantes: this.columnasFaltantes }, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "comprasConsolidandoProductosMensual_") : this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);;
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  generarOpciones() {
    this.opciones = [
      { label: LS.MSJ_CONSULTAR_KARDEX, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.consultarKardex() },
    ];
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.comprasConsProductoMenSeleccionado = fila ? fila.data : null;
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.comprasConsProductoMenSeleccionado = data;
    if (this.comprasConsProductoMenSeleccionado[1]) {
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
