import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { InvFunComprasConsolidandoProductosTO } from '../../../../entidadesTO/inventario/InvFunComprasConsolidandoProductosTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';
import { InvProveedorTO } from '../../../../entidadesTO/inventario/InvProveedorTO';
import { NgbModal } from '../../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ListadoProveedoresComponent } from '../../componentes/listado-proveedores/listado-proveedores.component';
import { BodegaService } from '../../archivo/bodega/bodega.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import * as moment from 'moment';
import { ComprasConsolidadoProductosService } from './compras-consolidado-productos.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { NgForm } from '../../../../../../node_modules/@angular/forms';
import { HotkeysService, Hotkey } from '../../../../../../node_modules/angular2-hotkeys';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { GridApi } from 'ag-grid';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ProductoService } from '../../componentes/producto/producto.service';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-compras-consolidado-productos',
  templateUrl: './compras-consolidado-productos.component.html',
  styleUrls: ['./compras-consolidado-productos.component.css']
})
export class ComprasConsolidadoProductosComponent implements OnInit {
  public listaResultadoComprasConsProd: Array<InvFunComprasConsolidandoProductosTO> = [];
  public listaBodegas: Array<InvListaBodegasTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public bodegaSeleccionada: InvListaBodegasTO = new InvListaBodegasTO();
  public comprasConsProductoSeleccionado: InvFunComprasConsolidandoProductosTO = new InvFunComprasConsolidandoProductosTO();
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public proveedor: InvProveedorTO = new InvProveedorTO(); //El proveedor se elegira en el modal
  public codigoProveedor: string = null;
  public fechaInicio: Date = new Date();
  public fechaFin: Date = new Date();
  public fechaActual: Date = new Date();
  public es: object = {};
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
    private consolidadoProductosService: ComprasConsolidadoProductosService
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['comprasConsolProductos'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.obtenerFechaInicioActualMes();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      if (this.listaResultadoComprasConsProd.length > 0) {
        let element: HTMLElement = document.getElementById('btnActivarComprasConsProductos') as HTMLElement;
        element ? element.click() : null;
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarConsProdCompras') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      if (this.listaResultadoComprasConsProd.length > 0) {
        let element: HTMLElement = document.getElementById('btnImprimirConsProdCompras') as HTMLElement;
        element.click();
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      if (this.listaResultadoComprasConsProd.length > 0) {
        let element: HTMLElement = document.getElementById('btnExportarConsProdCompra') as HTMLElement;
        element.click();
      }
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.bodegaSeleccionada = null;
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
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivo: true, sector: this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.sectorSeleccionado.secCodigo : null };
    this.bodegaService.listarInvListaBodegasPorSector(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvListaBodegasPorSector(data) {
    this.listaBodegas = data;
    if (this.listaBodegas.length > 0) {
      this.bodegaSeleccionada = this.bodegaSeleccionada && this.bodegaSeleccionada.bodCodigo ? this.listaBodegas.find(item => item.bodCodigo === this.bodegaSeleccionada.bodCodigo) : this.listaBodegas[0];
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
      if (this.sectorSeleccionado != null) {
        this.listarBodegas();
      }
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  limpiarResultado() {
    this.listaResultadoComprasConsProd = [];
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
    this.proveedor.provCodigo = "";
    this.proveedor.provRazonSocial = "";
  }

  //Proveedor
  buscarProveedor(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && !this.esValidoProveedor()) {
      if (this.proveedor && this.proveedor.provCodigo.length > 0) {
        let busqueda = this.proveedor.provCodigo.toUpperCase();
        let parametroBusqueda = { empresa: LS.KEY_EMPRESA_SELECT, categoria: null, inactivos: false, busqueda: busqueda };
        event.srcElement.blur();
        event.preventDefault();
        const modalRef = this.modalService.open(ListadoProveedoresComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.parametrosBusqueda = parametroBusqueda;
        modalRef.result.then((result: InvProveedorTO) => {
          if (result) {
            this.proveedor = new InvProveedorTO(result);
            this.codigoProveedor = this.proveedor.provCodigo;
          }
        }, () => {
          this.focusProveedorCodigo();
        });
      } else {
        this.toastr.info(LS.MSJ_ENTERTOMODAL, LS.TAG_AVISO);
      }
    }
  }

  focusProveedorCodigo() {
    let element = document.getElementById('provCodigo');
    element ? element.focus() : null;
  }

  esValidoProveedor(): boolean {
    return this.proveedor.provCodigo != "" && this.proveedor.provCodigo === this.codigoProveedor;
  }

  validarProveedor() {
    if (this.proveedor.provCodigo !== this.codigoProveedor) {
      this.proveedor = new InvProveedorTO();
      this.codigoProveedor = null;
    }
  }

  //kardex
  ejecutarAccion(data) {
    this.comprasConsProductoSeleccionado = data;
    this.consultarKardex();
  }

  consultarKardex() {
    if (this.comprasConsProductoSeleccionado && this.comprasConsProductoSeleccionado.ccpCodigo) {
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
      codigo: this.comprasConsProductoSeleccionado.ccpCodigo ? this.comprasConsProductoSeleccionado.ccpCodigo : ""
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
    this.limpiarResultado();
    if (form && form.valid) {
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaInicio),
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin),
        sector: this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.sectorSeleccionado.secCodigo : null,
        bodega: this.bodegaSeleccionada && this.bodegaSeleccionada.bodCodigo ? this.bodegaSeleccionada.bodCodigo : null,
        proveedor: this.codigoProveedor
      };
      this.filasTiempo.iniciarContador();
      this.consolidadoProductosService.listarInvFunComprasConsolidandoProductosTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarInvFunComprasConsolidandoProductosTO(data) {
    this.listaResultadoComprasConsProd = data;
    this.cargando = false;
    this.iniciarAgGrid();
    this.filasTiempo.finalizarContador();
  }

  imprimirConsProdCompra() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaInicio),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaFin),
        bodega: this.bodegaSeleccionada && this.bodegaSeleccionada.bodCodigo ? this.bodegaSeleccionada.bodNombre : '',
        proveedor: this.codigoProveedor ? this.proveedor.provRazonSocial : '',
        listInvFunComprasConsolidandoProductosTO: this.listaResultadoComprasConsProd
      };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteConsolidadoCompraProducto", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoComprasConsolidandoProductos.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarConsProdCompra() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listInvFunComprasConsolidandoProductosTO: this.listaResultadoComprasConsProd };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteComprasConsolidandoProductos", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, 'ListadoComprasConsolidandoProductos_') : this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
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
    this.columnDefs = this.consolidadoProductosService.generarColumnas();
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

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.comprasConsProductoSeleccionado = fila ? fila.data : null;
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.comprasConsProductoSeleccionado = data;
    if (this.comprasConsProductoSeleccionado.ccpCodigo) {
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
