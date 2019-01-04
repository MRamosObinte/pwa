import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';
import { SaldoBodegaComprobacionTO } from '../../../../entidadesTO/inventario/SaldoBodegaComprobacionTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { BodegaService } from '../../archivo/bodega/bodega.service';
import { SaldoBodegaComprobacionMontosService } from './saldo-bodega-comprobacion-montos.service';
import { LS } from '../../../../constantes/app-constants';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ProductoService } from '../../componentes/producto/producto.service';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';

@Component({
  selector: 'app-saldo-bodega-comprobacion-montos',
  templateUrl: './saldo-bodega-comprobacion-montos.component.html',
  styleUrls: ['./saldo-bodega-comprobacion-montos.component.css']
})
export class SaldoBodegaComprobacionMontosComponent implements OnInit {
  public activar: boolean = false; //
  public constantes: any; //Referencia a las constantes
  public cargando: boolean = false; //Es true cuando esta cargando algun dato desde el server.
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaBodegas: Array<InvListaBodegasTO> = new Array();
  public listadoResultadoSaldo: Array<SaldoBodegaComprobacionTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO(); //Identifica la empresa seleccionada
  public bodegaSeleccionada: InvListaBodegasTO = new InvListaBodegasTO();
  public objetoSeleccionado: SaldoBodegaComprobacionTO;
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public isScreamMd: boolean = true;
  public es: any = {}; //Locale Date (Obligatoria)
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

  constructor(
    private saldoBodegaComprobacionService: SaldoBodegaComprobacionMontosService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private bodegaService: BodegaService,
    private sistemaService: AppSistemaService,
    private productoService: ProductoService,
    private archivoService: ArchivoService
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS; //Hace referencia a los constantes
    this.listaEmpresas = this.route.snapshot.data['saldoBodegaComprobacionMontos'];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo : null;
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.inicializarAtajos();
    this.iniciarAgGrid();
    this.obtenerFechaInicioActualMes();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.bodegaSeleccionada = null;
    this.limpiarResultado();
    this.listarBodegas();
  }

  inicializarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarSaldoBodegaComprobMonto') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarSaldoBodegaComprobMonto') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirSaldoBodegaComprobMonto') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarSaldoBodegaComprobMonto') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  listarBodegas() {
    this.cargando = true;
    this.listaBodegas = [];
    this.limpiarResultado();
    this.bodegaService.listarInvListaBodegasTO({ empresa: this.empresaSeleccionada.empCodigo, inactivo: false }, this, LS.KEY_EMPRESA_SELECT);
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

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];//Fecha fin esta en la posicion 1
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarResultado() {
    this.gridApi = null;
    this.gridColumnApi = null;
    this.listadoResultadoSaldo = [];
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  //Kardex
  consultarKardex() {
    if (this.objetoSeleccionado.sbcProductoCodigo) {
      this.objetoDesdeFuera = {
        empresa: this.empresaSeleccionada,
        bodega: this.bodegaSeleccionada,
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
      codigo: this.objetoSeleccionado.sbcProductoCodigo ? this.objetoSeleccionado.sbcProductoCodigo : ""
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
    this.inicializarAtajos();
  }

  //Operaciones
  buscarSaldoBodegaComprobacion(form: NgForm) {
    this.cargando = true;
    this.limpiarResultado();
    if (form && form.valid) {
      this.filasTiempo.iniciarContador();
      let parametros = { 
        empresa: LS.KEY_EMPRESA_SELECT, 
        bodega: this.bodegaSeleccionada && this.bodegaSeleccionada.bodCodigo ? this.bodegaSeleccionada.bodCodigo : null,
        desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta)
      };
      this.saldoBodegaComprobacionService.listarInvFunSaldoBodegaComprobacionCantidadesTO(parametros, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarInvFunSaldoBodegaComprobacionCantidadesTO(data) {
    this.listadoResultadoSaldo = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
  }

  /** Metodo para imprimir listado de saldo bodega comprobación*/
  imprimirSaldoBodegaComprobMonto() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { bodega: this.bodegaSeleccionada.bodCodigo, fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde), fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta), lista: this.listadoResultadoSaldo };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteSaldoBodegaComprobacion", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoSaldoBodegaComprobacionMontos.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  /** Metodo para exportar listado de saldo bodega comprobación*/
  exportarSaldoBodegaComprobMonto() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { bodega: this.bodegaSeleccionada.bodCodigo, fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde), fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta), lista: this.listadoResultadoSaldo };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteSaldoBodegaComprobacion", parametros, this.empresaSeleccionada)
        .then(data => {
          data ? this.utilService.descargarArchivoExcel(data._body, "ListadoSaldoBodegaComprobacionMontos_") : this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.saldoBodegaComprobacionService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
    this.components = {};
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  ejecutarAccion(data) {
    this.objetoSeleccionado = data;
    this.consultarKardex();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
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
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

}
