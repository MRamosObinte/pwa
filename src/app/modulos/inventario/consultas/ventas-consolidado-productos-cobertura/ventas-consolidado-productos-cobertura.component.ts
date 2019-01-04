import { Component, OnInit, HostListener } from '@angular/core';
import { InvFunVentasConsolidandoProductosCoberturaTO } from '../../../../entidadesTO/inventario/InvFunVentasConsolidandoProductosCoberturaTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';
import { BodegaService } from '../../archivo/bodega/bodega.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ActivatedRoute } from '@angular/router';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { MotivoVentasService } from '../../archivo/motivo-ventas/motivo-ventas.service';
import { InvVentaMotivoComboTO } from '../../../../entidadesTO/inventario/InvVentaMotivoComboTO';
import * as moment from 'moment';
import { VentasConsolidadoProductosCoberturaService } from './ventas-consolidado-productos-cobertura.service';
import { NgForm } from '@angular/forms';
import { InvFunListadoClientesTO } from '../../../../entidadesTO/inventario/InvFunListadoClientesTO';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteListadoComponent } from '../../componentes/cliente-listado/cliente-listado.component';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ProductoService } from '../../componentes/producto/producto.service';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';

@Component({
  selector: 'app-ventas-consolidado-productos-cobertura',
  templateUrl: './ventas-consolidado-productos-cobertura.component.html',
  styleUrls: ['./ventas-consolidado-productos-cobertura.component.css']
})
export class VentasConsolidadoProductosCoberturaComponent implements OnInit {
  public listadoResultadoVentasConsProdCob: Array<InvFunVentasConsolidandoProductosCoberturaTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaBodegas: Array<InvListaBodegasTO> = [];
  public listaMotivos: Array<InvVentaMotivoComboTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public bodegaSeleccionada: InvListaBodegasTO = new InvListaBodegasTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public motivoSeleccionado: InvVentaMotivoComboTO = new InvVentaMotivoComboTO();
  public cliente: InvFunListadoClientesTO = new InvFunListadoClientesTO();
  public ventaConsProdCobSeleccionado: InvFunVentasConsolidandoProductosCoberturaTO;
  public constantes: any = LS;
  public es: object = {};
  public cargando: boolean = false;
  public activar: boolean = false;
  public screamXS: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  public codigoCliente: string = null;
  public frameworkComponents;
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

  constructor(
    private toastr: ToastrService,
    private utilService: UtilService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private archivoService: ArchivoService,
    private sistemaService: AppSistemaService,
    private sectorService: SectorService,
    private bodegaService: BodegaService,
    private motivoVentaService: MotivoVentasService,
    private modalService: NgbModal,
    private productoService: ProductoService,
    private ventasConsolidadoProductosCoberturaService: VentasConsolidadoProductosCoberturaService
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data["ventasConsolProductosCobertura"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.obtenerFechaInicioActualMes();
    this.iniciarAgGrid();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarVentasConsProdCob') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarVentasConsProdCob') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarVentasConsProdCob') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirVentasConsProdCob') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.motivoSeleccionado = null;
    this.bodegaSeleccionada = null;
    this.limpiarResultado();
    this.listarSectores();
    this.listarBodegas();
    this.listarMotivos();
  }

  limpiarResultado() {
    this.listadoResultadoVentasConsProdCob = [];
    this.filasTiempo.resetearContador();
    this.filasService.actualizarFilas("0", "0");
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
    this.listaSectores = [];
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
      this.bodegaSeleccionada = (this.bodegaSeleccionada && this.bodegaSeleccionada.bodCodigo) ? this.listaBodegas.find(item => item.bodCodigo === this.bodegaSeleccionada.bodCodigo) : null;
    } else {
      this.bodegaSeleccionada = null;
    }
    this.cargando = false;
  }

  listarMotivos() {
    this.cargando = true;
    this.listaMotivos = [];
    this.limpiarResultado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, filtrarInactivos: false };
    this.motivoVentaService.listarVentaMotivoComboTO(parametro, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarVentaMotivoComboTO(data) {
    this.listaMotivos = data;
    if (this.listaMotivos.length > 0) {
      this.motivoSeleccionado = (this.motivoSeleccionado && this.motivoSeleccionado.vmCodigo) ? this.listaMotivos.find(item => item.vmCodigo === this.motivoSeleccionado.vmCodigo) : null;
    } else {
      this.motivoSeleccionado = null;
    }
    this.cargando = false;
  }

  buscarCliente(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && !this.esValidoCliente()) {
      let parametro = {
        empresa: LS.KEY_EMPRESA_SELECT,
        busqueda: this.cliente.cliCodigo,
        mostrarInactivo: false
      }
      event.srcElement.blur();
      event.preventDefault();
      const modalRef = this.modalService.open(ClienteListadoComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
      modalRef.componentInstance.parametros = parametro;
      modalRef.componentInstance.isModal = true;
      modalRef.result.then((result) => {
        if (result) {
          this.cliente = result;
          this.codigoCliente = this.cliente.cliCodigo;
        }
      }, (reason) => {
        this.focusClienteCodigo();
      });
    }
  }

  esValidoCliente(): boolean {
    return this.cliente.cliCodigo != "" && this.cliente.cliCodigo === this.codigoCliente;
  }

  validarCliente() {
    if (this.cliente.cliCodigo !== this.codigoCliente) {
      this.cliente = new InvFunListadoClientesTO();
      this.codigoCliente = null;
    }
  }

  focusClienteCodigo() {
    let element = document.getElementById('clienteCodigo');
    element ? element.focus() : null;
  }

  //Operaciones
  buscarVentasConsProdCob(form: NgForm) {
    // this.limpiarResultado();
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        sector: this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.sectorSeleccionado.secCodigo : null,
        bodega: this.bodegaSeleccionada && this.bodegaSeleccionada.bodCodigo ? this.bodegaSeleccionada.bodCodigo : null,
        motivo: this.motivoSeleccionado && this.motivoSeleccionado.vmCodigo ? this.motivoSeleccionado.vmCodigo : null,
        cliente: this.codigoCliente
      };
      this.filasTiempo.iniciarContador();
      this.ventasConsolidadoProductosCoberturaService.listarInvFunVentasConsolidandoProductosCoberturaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarInvFunVentasConsolidandoProductosCoberturaTO(data) {
    this.filasTiempo.finalizarContador();
    this.listadoResultadoVentasConsProdCob = data;
    this.cargando = false;
    this.generarAtajosTeclado();
  }

  imprimirVentasConsProdCob() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta),
        bodega: this.bodegaSeleccionada ? this.bodegaSeleccionada.bodCodigo : '',
        motivo: this.motivoSeleccionado ? this.motivoSeleccionado.vmCodigo : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        cliente: this.codigoCliente ? this.codigoCliente : '',
        listInvFunVentasConsolidandoProductosCoberturaTO: this.listadoResultadoVentasConsProdCob
      };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteConsolidadoVentaProductoCobertura", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoConsolidandoVentaProductoCobertura.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarVentasConsProdCob() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta),
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        listInvFunVentasConsolidandoProductosCoberturaTO: this.listadoResultadoVentasConsProdCob
      };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteInvFunVentasConsolidandoProductosCoberturaTO", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "consolidandoVentaProductoCobertura_") : this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);;
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //kardex
  ejecutarAccion(data) {
    this.ventaConsProdCobSeleccionado = data;
    this.consultarKardex();
  }

  consultarKardex() {
    if (this.ventaConsProdCobSeleccionado && this.ventaConsProdCobSeleccionado.vcpCodigo) {
      this.objetoDesdeFuera = {
        empresa: this.empresaSeleccionada,
        bodega: this.bodegaSeleccionada ? this.bodegaSeleccionada : null,
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
      codigo: this.ventaConsProdCobSeleccionado.vcpCodigo ? this.ventaConsProdCobSeleccionado.vcpCodigo : ""
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

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.ventasConsolidadoProductosCoberturaService.generarColumnas();
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
    this.seleccionarPrimerFila();
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
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

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.ventaConsProdCobSeleccionado = fila ? fila.data : null;
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
