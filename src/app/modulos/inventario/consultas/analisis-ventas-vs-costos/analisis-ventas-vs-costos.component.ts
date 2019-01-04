import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { InvFunVentasVsCostoTO } from '../../../../entidadesTO/inventario/InvFunVentasVsCostoTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';
import { GridApi } from 'ag-grid';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import * as moment from 'moment';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { NgForm } from '@angular/forms';
import { AnalisisVentasVsCostosService } from './analisis-ventas-vs-costos.service';
import { BodegaService } from '../../archivo/bodega/bodega.service';
import { InvCliente } from '../../../../entidades/inventario/InvCliente';
import { ClienteListadoComponent } from '../../componentes/cliente-listado/cliente-listado.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ProductoService } from '../../componentes/producto/producto.service';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-analisis-ventas-vs-costos',
  templateUrl: './analisis-ventas-vs-costos.component.html',
  styleUrls: ['./analisis-ventas-vs-costos.component.css']
})
export class AnalisisVentasVsCostosComponent implements OnInit {
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaBodegas: Array<InvListaBodegasTO> = [];
  public listaResultadoAnalisisVentasVsCostos: Array<InvFunVentasVsCostoTO> = [];
  public analisisVentasVsCostosSeleccionado: InvFunVentasVsCostoTO = new InvFunVentasVsCostoTO();
  public bodegaSeleccionada: InvListaBodegasTO = new InvListaBodegasTO();
  public cliente: InvCliente = new InvCliente();
  public clienteCodigo: string = null;
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public es: object = {};
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  public filasTiempo: FilasTiempo = new FilasTiempo();
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
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private sistemaService: AppSistemaService,
    private bodegaService: BodegaService,
    private modalService: NgbModal,
    private productoService: ProductoService,
    private analisisVentasVsCostosService: AnalisisVentasVsCostosService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data["analisisVentasVsCostos"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.iniciarAtajosTeclado();
    this.obtenerFechaInicioActualMes();
    this.focusClienteCodigo();
  }

  iniciarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarAnalisisVentasVsCostos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarAnalisisVentasVsCostos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirAnalisisVentasVsCostos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarAnalisisVentasVsCostos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultadoAnalisisVentasVsCostos.length > 0) {
        this.consultarKardex();
      }
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.bodegaSeleccionada = null;
    this.limpiarResultado();
    this.cliente.invClientePK.cliCodigo = "";
    this.cliente.cliRazonSocial = "";
    this.listarBodegas();
  }

  limpiarResultado() {
    this.listaResultadoAnalisisVentasVsCostos = [];
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

  //cliente
  buscarCliente(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && this.cliente.invClientePK.cliCodigo) {
      let fueBuscado = (this.cliente.invClientePK.cliCodigo && this.clienteCodigo && this.cliente.invClientePK.cliCodigo === this.clienteCodigo);
      if (!fueBuscado) {
        let parametro = { empresa: LS.KEY_EMPRESA_SELECT, busqueda: this.cliente.invClientePK.cliCodigo, mostrarInactivo: false }
        event.srcElement.blur();
        event.preventDefault();
        this.abrirModalCliente(parametro);
      }
    }
  }

  abrirModalCliente(parametro) {
    const modalRef = this.modalService.open(ClienteListadoComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.parametros = parametro;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      if (result) {
        this.clienteCodigo = result ? result.cliCodigo : null;
        this.cliente.invClientePK.cliCodigo = result ? result.cliCodigo : null;
        this.cliente.cliRazonSocial = result ? result.cliRazonSocial : null;
        this.cliente.invClienteGrupoEmpresarial.geNombre = result ? result.cliGrupoEmpresarialNombre : null;
        this.focusClienteCodigo();
      } else {
        this.focusClienteCodigo();
      }
    }, () => {
      this.focusClienteCodigo();
    });
  }

  validarCliente() {
    if (this.cliente.invClientePK.cliCodigo !== this.clienteCodigo) {
      this.clienteCodigo = null;
      this.cliente = new InvCliente();
    }
  }

  focusClienteCodigo() {
    let element = document.getElementById('codCliente');
    element ? element.focus() : null;
  }

  //kardex
  ejecutarAccion(data) {
    this.analisisVentasVsCostosSeleccionado = data;
    this.consultarKardex();
  }

  consultarKardex() {
    if (this.analisisVentasVsCostosSeleccionado && this.analisisVentasVsCostosSeleccionado.vcCodigo) {
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
      codigo: this.analisisVentasVsCostosSeleccionado.vcCodigo ? this.analisisVentasVsCostosSeleccionado.vcCodigo : ""
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
    this.iniciarAtajosTeclado();
  }

  /**Operaciones */
  buscarAnalisisVentasVsCosto(form: NgForm) {
    this.cargando = true;
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      this.filasTiempo.iniciarContador();
      let parametro = {
        desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        empresa: this.empresaSeleccionada.empCodigo,
        bodega: this.bodegaSeleccionada ? this.bodegaSeleccionada.bodCodigo : null,
        cliente: this.clienteCodigo
      }
      this.analisisVentasVsCostosService.listarInvFunVentasVsCostoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarInvFunVentasVsCostoTO(data) {
    this.listaResultadoAnalisisVentasVsCostos = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  imprimirAnalisisVentasVsCosto() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta),
        bodega: this.bodegaSeleccionada ? this.bodegaSeleccionada.bodCodigo : '',
        clienteId: '',
        invFunVentasVsCostoTO: this.listaResultadoAnalisisVentasVsCostos
      };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteInvFunVentasVsCosto", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('listadoAnalisisVentasVsCosto.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarAnalisisVentasVsCosto() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listInvFunVentasVsCostoTO: this.listaResultadoAnalisisVentasVsCostos };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteInvFunVentasVsCosto", parametros, this.empresaSeleccionada)
        .then(data => {
          data ? this.utilService.descargarArchivoExcel(data._body, "analisisVentasVsCosto_") : this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
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
    this.columnDefs = this.analisisVentasVsCostosService.generarColumnas();
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
    this.analisisVentasVsCostosSeleccionado = fila ? fila.data : null;
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
    this.analisisVentasVsCostosSeleccionado = data;
    if (this.analisisVentasVsCostosSeleccionado.vcCodigo) {
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
