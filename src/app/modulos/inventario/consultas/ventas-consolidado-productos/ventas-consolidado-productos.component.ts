import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { InvFunVentasConsolidandoProductosTO } from '../../../../entidadesTO/inventario/InvFunVentasConsolidandoProductosTO';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { NgbModal } from '../../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { BodegaService } from '../../archivo/bodega/bodega.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from '../../../../../../node_modules/angular2-hotkeys';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { VentasConsolidadoProductosService } from './ventas-consolidado-productos.service';
import * as moment from 'moment';
import { NgForm } from '../../../../../../node_modules/@angular/forms';
import { InvFunListadoClientesTO } from '../../../../entidadesTO/inventario/InvFunListadoClientesTO';
import { ClienteListadoComponent } from '../../componentes/cliente-listado/cliente-listado.component';
import { GridApi } from 'ag-grid';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ProductoService } from '../../componentes/producto/producto.service';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-ventas-consolidado-productos',
  templateUrl: './ventas-consolidado-productos.component.html',
  styleUrls: ['./ventas-consolidado-productos.component.css']
})
export class VentasConsolidadoProductosComponent implements OnInit {
  public listaResultado: Array<InvFunVentasConsolidandoProductosTO> = [];
  public listaBodegas: Array<InvListaBodegasTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public bodegaSeleccionada: InvListaBodegasTO = new InvListaBodegasTO();
  public ventaConsolSeleccionado: InvFunVentasConsolidandoProductosTO;
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public screamXS: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public cliente: InvFunListadoClientesTO = new InvFunListadoClientesTO();//El proveedor se elegira en el modal
  public codigoCliente: string = null;
  public fechaInicio: Date = new Date();
  public fechaFin: Date = new Date();
  public fechaActual: Date = new Date();
  public es: object = {};
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public objetoDesdeFuera;// PARA MOSTRAR KARDEX
  public mostrarKardex: boolean = false;;// PARA MOSTRAR KARDEX
  public frameworkComponents;
  //
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private utilService: UtilService,
    private sectorService: SectorService,
    private route: ActivatedRoute,
    private bodegaService: BodegaService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private archivoService: ArchivoService,
    private sistemaService: AppSistemaService,
    private productoService: ProductoService,
    private consolidadoProductosService: VentasConsolidadoProductosService
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['ventasConsolProductos'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.obtenerFechaInicioActualMes();
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
    this.focusClienteCodigo();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      if (this.listaResultado.length > 0) {
        let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
        element ? element.click() : null;
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      if (this.listaResultado.length > 0) {
        let element: HTMLElement = document.getElementById('btnImprimirConsProdVenta') as HTMLElement;
        element.click();
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        let element: HTMLElement = document.getElementById('btnExportarConsProdVenta') as HTMLElement;
        element.click();
      }
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.bodegaSeleccionada = null;
    this.listarBodegas();
    this.listarSectores();
    this.limpiarResultado();
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
        this.fechaFin = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  listarBodegas() {
    this.cargando = true;
    this.limpiarResultado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivo: true };
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

  limpiarResultado() {
    this.listaResultado = [];
    this.filasTiempo.resetearContador();
    this.cliente.cliCodigo = "";
    this.cliente.cliRazonSocial = "";
  }

  //kardex
  ejecutarAccion(data) {
    this.ventaConsolSeleccionado = data;
    this.consultarKardex();
  }

  consultarKardex() {
    if (this.ventaConsolSeleccionado && this.ventaConsolSeleccionado.vcpCodigo) {
      this.objetoDesdeFuera = {
        empresa: this.empresaSeleccionada,
        bodega: this.bodegaSeleccionada,
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
      codigo: this.ventaConsolSeleccionado.vcpCodigo ? this.ventaConsolSeleccionado.vcpCodigo : ""
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
  buscarConsolidadoProductos(form: NgForm) {
    this.cargando = true;
    if (form && form.valid) {
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        sector: this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.sectorSeleccionado.secCodigo : null,
        bodega: this.bodegaSeleccionada && this.bodegaSeleccionada.bodCodigo ? this.bodegaSeleccionada.bodCodigo : null,
        proveedor: this.codigoCliente
      };
      this.filasTiempo.iniciarContador();
      this.consolidadoProductosService.listarInvFunVentasConsolidandoProductosTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarInvFunVentasConsolidandoProductosTO(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
  }

  imprimirConsProdVenta() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaInicio),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaFin),
        bodega: this.bodegaSeleccionada && this.bodegaSeleccionada.bodCodigo ? this.bodegaSeleccionada.bodNombre : '',
        cliente: this.codigoCliente ? this.cliente.cliRazonSocial : '',
        listInvFunVentasConsolidandoProductosTO: this.listaResultado
      };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteConsolidadoVentaProducto", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoVentasConsolidandoProductos.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarConsProdVenta() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listInvFunVentasConsolidandoProductosTO: this.listaResultado };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteVentasConsolidandoProductos", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, 'ListadoVentasConsolidandoProductos_') : this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //CLIENTE
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
      }, () => {
        this.focusClienteCodigo();
      });
    }
  }

  focusClienteCodigo() {
    let element = document.getElementById('clienteCodigo');
    element ? element.focus() : null;
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

  generarOpciones() {
    this.opciones = [
      { label: LS.MSJ_CONSULTAR_KARDEX, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.consultarKardex() },
    ];
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.consolidadoProductosService.generarColumnas();
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
    this.ventaConsolSeleccionado = fila ? fila.data : null;
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.ventaConsolSeleccionado = data;
    if (this.ventaConsolSeleccionado.vcpCodigo) {
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
