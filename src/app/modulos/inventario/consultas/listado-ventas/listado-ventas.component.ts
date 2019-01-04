import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvFunVentasTO } from '../../../../entidadesTO/inventario/InvFunVentasTO';
import { InvVentaMotivoTO } from '../../../../entidadesTO/inventario/InvVentaMotivoTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { AnxTipoComprobanteComboTO } from '../../../../entidadesTO/anexos/AnxTipoComprobanteComboTO';
import { TipoDocumentoService } from '../../../anexos/archivo/tipo-documento/tipo-documento.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { MotivoVentasService } from '../../archivo/motivo-ventas/motivo-ventas.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { InvFunListadoClientesTO } from '../../../../entidadesTO/inventario/InvFunListadoClientesTO';
import { ClienteListadoComponent } from '../../componentes/cliente-listado/cliente-listado.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { NgForm } from '@angular/forms';
import { VentaListadoService } from '../../componentes/venta-listado/venta-listado.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.component.html',
  styleUrls: ['./listado-ventas.component.css']
})
export class ListadoVentasComponent implements OnInit {
  public listaResultadoVentas: Array<InvFunVentasTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaMotivos: Array<InvVentaMotivoTO> = [];
  public listaTipoComprobante: Array<AnxTipoComprobanteComboTO> = [];
  public motivoSeleccionado: InvVentaMotivoTO = new InvVentaMotivoTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public tipoComprobanteSeleccionado: AnxTipoComprobanteComboTO = new AnxTipoComprobanteComboTO();
  public cliente: InvFunListadoClientesTO = new InvFunListadoClientesTO();
  public ventaSeleccionada: InvFunVentasTO;
  public codigoCliente: string = null;
  public constantes: any = LS;
  public cargando: boolean = false;
  public activarVentas: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
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
  public frameworkComponents;
  public screamXS: boolean = true;
  public filtroGlobal = "";
  //Consultar venta
  parametrosFormulario: any = {};
  vistaFormulario: boolean = false;
  tipoDocumento: string = null;
  //Consultar contable
  public objetoContableEnviar = null;
  public tamanioEstructura: number = 0;
  public mostrarContabilidaAcciones: boolean = false;

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];

  constructor(
    private tipoDocumentoService: TipoDocumentoService,
    private filasService: FilasResolve,
    private sistemaService: AppSistemaService,
    private utilService: UtilService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private sectorService: SectorService,
    private modalService: NgbModal,
    private atajoService: HotkeysService,
    private motivoService: MotivoVentasService,
    private archivoService: ArchivoService,
    private ventasListadoService: VentaListadoService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['ventasListado'];
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
      let element: HTMLElement = document.getElementById('btnActivarListadoVentas') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarListadoVentas') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirListadoVentas') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarListadoVentas') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.motivoSeleccionado = null;
    this.tipoComprobanteSeleccionado = null;
    this.listarMotivos();
    this.listarSectores();
    this.listarTiposComprobante();
    this.cliente = new InvFunListadoClientesTO();
    this.codigoCliente = null;
    this.limpiarResultado();
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  /**Tipo comprobante */
  listarTiposComprobante() {
    this.cargando = true;
    this.listaTipoComprobante = [];
    this.limpiarResultado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, codigoTipoTransaccion: null };
    this.tipoDocumentoService.listarAnxTipoComprobanteComboTO(parametro, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarAnxTipoComprobanteComboTO(data) {
    this.listaTipoComprobante = data;
    if (this.listaTipoComprobante.length > 0) {
      this.tipoComprobanteSeleccionado = (this.tipoComprobanteSeleccionado && this.tipoComprobanteSeleccionado.tcCodigo) ? this.listaTipoComprobante.find(item => item.tcCodigo === this.tipoComprobanteSeleccionado.tcCodigo) : null;
    } else {
      this.tipoComprobanteSeleccionado = null;
    }
    this.cargando = false;
  }

  /**Motivos de ventas */
  listarMotivos() {
    this.cargando = true;
    this.listaMotivos = [];
    this.limpiarResultado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, activos: true };
    this.motivoService.listarVentaMotivoComboTO(parametro, this, LS.KEY_EMPRESA_SELECT)
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

  /**Sectores */
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

  limpiarResultado() {
    this.listaResultadoVentas = [];
    this.filasService.actualizarFilas("0", "0");
  }

  //Operaciones
  buscarListadoVentas(form: NgForm) {
    this.limpiarResultado();
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        desde: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde),
        hasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        documento: this.tipoComprobanteSeleccionado && this.tipoComprobanteSeleccionado.tcCodigo ? this.tipoComprobanteSeleccionado.tcCodigo : null,
        motivo: this.motivoSeleccionado && this.motivoSeleccionado.vmCodigo ? this.motivoSeleccionado.vmCodigo : null,
        sector: this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.sectorSeleccionado.secCodigo : null,
        cliente: this.codigoCliente
      };
      this.filasTiempo.iniciarContador();
      this.ventasListadoService.listarInvFunVentasTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarInvFunVentasTO(data) {
    this.listaResultadoVentas = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
  }

  imprimirListadoVentas() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta),
        motivo: this.motivoSeleccionado ? this.motivoSeleccionado.vmDetalle : '',
        cliente: this.codigoCliente ? this.codigoCliente : '',
        documento: this.tipoComprobanteSeleccionado ? this.tipoComprobanteSeleccionado.tcCodigo : '',
        listInvFunVentasTO: this.listaResultadoVentas
      };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteListadoVentas", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoVentas.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarListadoVentas() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde),
        fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta),
        motivo: this.motivoSeleccionado ? this.motivoSeleccionado.vmDetalle : '',
        cliente: this.codigoCliente ? this.codigoCliente : '',
        documento: this.tipoComprobanteSeleccionado ? this.tipoComprobanteSeleccionado.tcDescripcion : '',
        listInvFunVentasTO: this.listaResultadoVentas
      };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteListadoVentas", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, 'ListadoVentas_') : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //CONSULTAR VENTA
  consultarVenta() {
    if (this.ventaSeleccionada.vtaIdNumero) {
      this.tipoDocumento = this.ventaSeleccionada.vtaDocumentoTipo;
      this.parametrosFormulario = {
        accion: LS.ACCION_CONSULTAR,
        seleccionado: {
          cliCodigo: this.ventaSeleccionada.vtaIdNumero,
          cliNombre: this.ventaSeleccionada.vtaCliente,
          conNumero: this.ventaSeleccionada.vtaDocumentoNumero,
          id: null,
          vtaBase: this.ventaSeleccionada.vtaBase0,
          vtaBaseImponible: this.ventaSeleccionada.vtaBaseImponible,
          vtaFecha: this.ventaSeleccionada.vtaFecha,
          vtaFormaPago: this.ventaSeleccionada.vtaFormaPago,
          vtaMontoIva: this.ventaSeleccionada.vtaMontoIva,
          vtaNumero: this.ventaSeleccionada.vtaNumeroSistema,
          vtaObservaciones: this.ventaSeleccionada.vtaObservaciones,
          vtaStatus: this.ventaSeleccionada.vtaPendiente ? LS.ETIQUETA_PENDIENTE : this.ventaSeleccionada.vtaAnulado ? LS.ETIQUETA_ANULADO : null,
          vtaTotal: this.ventaSeleccionada.vtaTotal,
        }
      }
      this.vistaFormulario = true;
      this.activarVentas = true;
    }
  }

  cancelar() {
    this.vistaFormulario = false;
    this.activarVentas = false;
  }

  ejecutarAccion(event) {
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.activarVentas = event.estado;
        break;
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
    }
  }

  /**
   * Método para consultar contable
   *
   * @memberof ListadoVentasComponent
   */
  consultarContable() {
    if (this.ventaSeleccionada.vtaIdNumero) {
      let itemVentas: Array<string> = this.ventaSeleccionada.vtaNumeroSistema.split("|");
      let periodo = itemVentas[0];
      let numero = itemVentas[2];
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: periodo + "|" + "C-VEN |" + numero,
        listadoSectores: [],
        tamanioEstructura: this.tamanioEstructura,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        tipoContable: null,
        listaPeriodos: [],
        volverACargar: false
      };
    }
  }

  /** Metodo que se necesita para app-contable-formulario(componente), cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  /** Metodo que se necesita para app-contable-formulario(componente), cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.activarVentas = event;
    this.cdRef.detectChanges();
  }

  cerrarContabilidadAcciones(event) {
    this.activarVentas = event.objetoEnviar ? event.objetoEnviar.activar : false;
    this.objetoContableEnviar = event.objetoEnviar;
    this.mostrarContabilidaAcciones = event.mostrarContilidadAcciones;
    this.actualizarFilas();
    this.cdRef.detectChanges();
    this.generarAtajosTeclado();
  }

  generarOpciones() {
    let isValido = this.ventaSeleccionada.vtaIdNumero;
    this.opciones = [
      { label: LS.LABEL_CONSULTAR_VENTA, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.consultarVenta() : null },
      { label: LS.ACCION_CONSULTAR_CONTABLE, icon: LS.ICON_CONSULTAR, disabled: !isValido, command: () => isValido ? this.consultarContable() : null }
    ];
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.ventasListadoService.generarColumnasListadoVentas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
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
    this.ventaSeleccionada = fila ? fila.data : null;
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.ventaSeleccionada = data;
    if (this.ventaSeleccionada.vtaIdNumero) {
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
