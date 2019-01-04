import { Component, OnInit, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService } from 'angular2-hotkeys/src/hotkeys.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { SaldoBodegaService } from './saldo-bodega.service';
import { Hotkey } from 'angular2-hotkeys';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';
import { BodegaService } from '../../archivo/bodega/bodega.service';
import { NgForm } from '@angular/forms';
import { SaldoBodegaTO } from '../../../../entidadesTO/inventario/SaldoBodegaTO';
import * as moment from 'moment';
import { GridApi } from 'ag-grid';
import { ProductoService } from '../../componentes/producto/producto.service';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';

@Component({
  selector: 'app-saldo-bodega',
  templateUrl: './saldo-bodega.component.html',
  styleUrls: ['./saldo-bodega.component.css']
})
export class SaldoBodegaComponent implements OnInit {
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaResultadoSaldoBodega: Array<SaldoBodegaTO> = [];
  public listaBodegas: Array<InvListaBodegasTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public bodegaSeleccionado: InvListaBodegasTO = new InvListaBodegasTO();
  public saldoBodegaSeleccionada: SaldoBodegaTO;
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public es: object = {};
  public fechaHasta: Date = new Date();
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
  public filtroGlobal = "";

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private saldoBodegaService: SaldoBodegaService,
    private archivoService: ArchivoService,
    private bodegaService: BodegaService,
    private productoService: ProductoService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['saldoBodegaInv'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtgajosTeclado();
  }


  listaBodegasTO() {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivo: true };
    this.bodegaService.listarInvListaBodegasTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvListaBodegasTO(data) {
    this.listaBodegas = data;
    if (this.listaBodegas.length > 0) {
      this.bodegaSeleccionado = this.bodegaSeleccionado && this.bodegaSeleccionado.bodCodigo ? this.listaBodegas.find(item => item.bodCodigo === this.bodegaSeleccionado.bodCodigo) : this.listaBodegas[0];
    } else {
      this.bodegaSeleccionado = null;
    }
    this.cargando = false;
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.bodegaSeleccionado = null;
    this.limpiarResultado();
    this.listaBodegasTO();
  }

  generarAtgajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarSaldoBodega') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarSaldoBodega') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarSaldoBodega') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirSaldoBodega') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //kardex
  ejecutarAccion(data) {
    this.saldoBodegaSeleccionada = data;
    this.consultarKardex();
  }

  consultarKardex() {
    if (this.saldoBodegaSeleccionada && this.saldoBodegaSeleccionada.sbProducto) {
      let desde = new Date(this.utilService.obtenerFechaInicioMes());
      desde.setMonth(desde.getMonth() - 1);
      this.objetoDesdeFuera = {
        empresa: this.empresaSeleccionada,
        bodega: this.bodegaSeleccionado ? this.bodegaSeleccionado : null,
        fechaDesde: desde,
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
      codigo: this.saldoBodegaSeleccionada.sbProducto ? this.saldoBodegaSeleccionada.sbProducto : ""
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
    this.generarAtgajosTeclado();
  }

  //Operaciones
  buscarSaldoBodega(form?: NgForm) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      this.limpiarResultado();
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        bodega: this.bodegaSeleccionado && this.bodegaSeleccionado.bodCodigo ? this.bodegaSeleccionado.bodCodigo : null,
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta)
      };
      this.saldoBodegaService.listarInvListaSaldoBodegaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarInvListaSaldoBodegaTO(data) {
    this.listaResultadoSaldoBodega = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  /** Metodo para imprimir listado de saldo bodega */
  imprimirSaldoBodega() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { bodega: this.bodegaSeleccionado.bodCodigo, fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta), listSaldoBodegaTO: this.listaResultadoSaldoBodega };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteSaldoBodega", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoSaldoBodega.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  /** Metodo para exportar listado de saldo bodega */
  exportarSaldoBodega() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta), listSaldoBodegaTO: this.listaResultadoSaldoBodega };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteSaldoBodega", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoSaldoBodega_") : this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  limpiarResultado() {
    this.listaResultadoSaldoBodega = [];
    this.filasService.actualizarFilas("0", "0");
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.saldoBodegaService.generarColumnas();
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

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.saldoBodegaSeleccionada = fila ? fila.data : null;
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
