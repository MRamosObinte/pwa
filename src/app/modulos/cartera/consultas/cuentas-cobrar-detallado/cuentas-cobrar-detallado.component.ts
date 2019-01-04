import { Component, OnInit, ViewChild, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvCliente } from '../../../../entidades/inventario/InvCliente';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { CuentasPorCobrarDetalladoTO } from '../../../../entidadesTO/cartera/CuentasPorCobrarDetalladoTO';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { CuentasCobrarDetalladoService } from './cuentas-cobrar-detallado.service';
import * as moment from 'moment';
import { ClienteListadoComponent } from '../../../inventario/componentes/cliente-listado/cliente-listado.component';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InvListaConsultaVentaTO } from '../../../../entidadesTO/inventario/InvListaConsultaVentaTO';

@Component({
  selector: 'app-cuentas-cobrar-detallado',
  templateUrl: './cuentas-cobrar-detallado.component.html',
  styleUrls: ['./cuentas-cobrar-detallado.component.css']
})
export class CuentasCobrarDetalladoComponent implements OnInit {

  @Input() data;
  public mostrarBtnCancelar: boolean = false;
  @Output() cerrarCuentaDetallada = new EventEmitter();
  //
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  //
  public cliente: InvCliente = new InvCliente();
  public clienteCodigo: string = null;
  //
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  //
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public es: object = {};
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  //
  public listaResultado: Array<CuentasPorCobrarDetalladoTO> = [];
  public objetoSeleccionado: CuentasPorCobrarDetalladoTO;
  //
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];
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
  public innerWidth: number;
  public filtroGlobal = "";
  //Consultar venta
  parametrosFormulario: any = {};
  vistaFormulario: boolean = false;
  public tipoDocumento: string = "";

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private modalService: NgbModal,
    private sistemaService: AppSistemaService,
    private sectorService: SectorService,
    private cuentasCobrarService: CuentasCobrarDetalladoService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data["cuentasPorCobrarDetallado"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.iniciarAtajosTeclado();
    this.obtenerFechaInicioActualMes();
    if (this.data) {
      this.setearValores();
    }
    this.focusClienteCodigo();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.cliente.invClientePK.cliCodigo = "";
    this.cliente.cliRazonSocial = "";
    this.sectorSeleccionado = null;
    this.listarSectores();
    this.limpiarResultado();
  }

  listarSectores() {
    this.cargando = true;
    this.limpiarResultado();
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: true };
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
    this.filasService.actualizarFilas("0", "0");
    this.vistaFormulario = false;
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  buscarCarListaCuentasPorCobrarDetallado(estado) {
    this.cargando = true;
    this.limpiarResultado();
    this.filasTiempo.iniciarContador();
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
      cliente: this.clienteCodigo,
      desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
      hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
      ichfa: estado
    }
    this.cuentasCobrarService.listarCarListaCuentasPorCobrarDetallado(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarCarListaCuentasPorCobrarDetallado(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  imprimirCarListaCuentasPorCobrarDetallado() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        cliente: this.cliente ? this.cliente.cliRazonSocial : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        listado: this.listaResultado,
      };
      this.cuentasCobrarService.imprimirCarListaCuentasPorCobrarDetallado(parametros, this, this.empresaSeleccionada);
    }
  }

  exportarCarListaCuentasPorCobrarDetallado() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        cliente: this.cliente ? this.cliente.cliRazonSocial : '',
        sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : '',
        fechaDesde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        listado: this.listaResultado,
      };
      this.cuentasCobrarService.exportarCarListaCuentasPorCobrarDetallado(parametros, this, this.empresaSeleccionada);
    }
  }

  // CONSULTAR VENTAS
  consultarVentas() {
    if (this.objetoSeleccionado.cxcdPeriodo && this.objetoSeleccionado.cxcdMotivo && this.objetoSeleccionado.cxcdNumero) {
      this.parametrosFormulario.accion = LS.ACCION_CONSULTAR;
      this.parametrosFormulario.seleccionado = this.armarObjetoConsultaVentas();
      this.vistaFormulario = true;
      this.activar = true;
    }
  }

  armarObjetoConsultaVentas(): InvListaConsultaVentaTO {
    let venta: InvListaConsultaVentaTO = new InvListaConsultaVentaTO(this.objetoSeleccionado);
    venta.vtaDocumentoTipo = null;
    venta.vtaNumero = this.objetoSeleccionado.cxcdPeriodo + "|" + this.objetoSeleccionado.cxcdMotivo + "|" + this.objetoSeleccionado.cxcdNumero;
    return venta;
  }

  ejecutarAccionVenta(event) {
    switch (event.accion) {
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
      case LS.ACCION_ACTIVAR:
        this.activar = !this.activar;
        break;
    }
  }

  cancelar() {
    this.vistaFormulario = false;
    this.activar = false;
    this.iniciarAtajosTeclado();
  }

  setearValores() {
    this.listaEmpresas = this.data.listaEmpresas;
    this.listaSectores = this.data.listaSectores;
    this.empresaSeleccionada = this.data.empresa;
    this.sectorSeleccionado = this.data.sector;
    this.clienteCodigo = this.data.cliente;
    this.fechaDesde = null;
    this.fechaHasta = this.data.hasta;
    this.mostrarBtnCancelar = this.data.mostrarBtnCancelar;
    this.buscarCarListaCuentasPorCobrarDetallado(false);
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

  iniciarAtajosTeclado() {
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
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        //consultar cobros
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnRegresar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  generarOpciones() {
    let isValido = this.listaResultado.length > 0 ? this.objetoSeleccionado.cxcdPeriodo : false;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_VENTAS, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.consultarVentas() : null }
    ];
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.cuentasCobrarService.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent,
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    if (this.objetoSeleccionado.cxcdPeriodo) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  ejecutarAccion(event) {
    this.consultarVentas();
  }

  cerrarCuentaDetallado(){
    this.cerrarCuentaDetallada.emit(false);
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
