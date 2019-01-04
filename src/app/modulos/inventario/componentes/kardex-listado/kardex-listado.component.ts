import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { InvKardexTO } from '../../../../entidadesTO/inventario/InvKardexTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { KardexService } from '../kardex/kardex.service';
import * as moment from 'moment';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';
import { BodegaService } from '../../archivo/bodega/bodega.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { GridApi } from '../../../../../../node_modules/ag-grid';
import { ContextMenu } from '../../../../../../node_modules/primeng/contextmenu';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';
import { InvListaConsultaVentaTO } from '../../../../entidadesTO/inventario/InvListaConsultaVentaTO';
import { VentaService } from '../../transacciones/venta/venta.service';
import { InvListaConsultaConsumosTO } from '../../../../entidadesTO/inventario/InvListaConsultaConsumosTO';
import { ConsumoService } from '../../../produccion/transacciones/consumo/consumo.service';
import { InvConsumosMotivoTO } from '../../../../entidadesTO/inventario/InvConsumosMotivoTO';
import { TransferenciasService } from '../../transacciones/transferencias/transferencias.service';
import { ComprasService } from '../../transacciones/compras/compras.service';
import { InvComprasPK } from '../../../../entidades/inventario/InvComprasPK';
import { CambiarFechaRecepcionComponent } from '../cambiar-fecha-recepcion/cambiar-fecha-recepcion.component';
import { InvComprasRecepcionTO } from '../../../../entidadesTO/inventario/InvComprasRecepcionTO';

@Component({
  selector: 'app-kardex-listado',
  templateUrl: './kardex-listado.component.html',
  styleUrls: ['./kardex-listado.component.css']
})
export class KardexListadoComponent implements OnInit, OnChanges {
  @Input() parametrosBusqueda: any;
  @Input() datos: any;
  @Input() isModal: boolean = false;
  @Output() enviarCancelar: EventEmitter<any> = new EventEmitter();
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Output() enviarMostrarBtnRegresarFormulario: EventEmitter<any> = new EventEmitter();
  @Output() mostrandoFormulario: EventEmitter<any> = new EventEmitter();

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public activar: boolean = false; //
  public esKardex: boolean = true; //
  public constantes: any; //Referencia a las constantes
  public cargando: boolean = false; //Es true cuando esta cargando algun dato desde el server.
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = Array();
  public listadoResultado: Array<InvKardexTO> = new Array();
  public objetoSeleccionado: InvKardexTO = new InvKardexTO();
  public isScreamMd: boolean = true;
  public opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public fechaActual: Date = new Date();
  public listaBodegas: Array<InvListaBodegasTO> = new Array();
  public es: any = {}; //Locale Date (Obligatoria)
  public estilos: any = {};
  @Output() enviarAccion = new EventEmitter();
  //VENTA
  public vistaFormulario: boolean = false;
  public tipoDocumento: string = null;
  public parametrosFormulario;
  //CONSUMOS
  public parametrosFormularioConsumo;
  public listaConsumoMotivo: Array<InvConsumosMotivoTO> = []
  //TRANSFERENCIAS
  public parametrosFormularioTransferencia;
  //COMPRAS
  public parametrosCompra: any;

  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public rowClassRules: any = {};

  constructor(
    private kardexService: KardexService,
    public utilService: UtilService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    public activeModal: NgbActiveModal,
    private bodegaService: BodegaService,
    private toastr: ToastrService,
    private ventaService: VentaService,
    private consumoService: ConsumoService,
    private archivoService: ArchivoService,
    private transferenciasService: TransferenciasService,
    private comprasService: ComprasService,
    private modalService: NgbModal,
  ) {
    moment.locale('es');
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
  }

  ngOnChanges(changes: SimpleChanges) {
    //Si los parametros no son nulos 
    if (changes.parametrosBusqueda && this.parametrosBusqueda) {
      this.listaConsumoMotivo = this.parametrosBusqueda.listaConsumoMotivo;
      this.iniciarBusqueda();
    }
    if (changes.parametrosBusqueda && this.parametrosBusqueda === null) {
      this.limpiarResultado();//Si la busqueda es nulo entonces limpiamos el resultado actual 
    }
  }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.iniciarAtajos();
    //Si es modal y tiene parametros de busqueda
    if (this.isModal && this.parametrosBusqueda) {
      this.fechaDesde = new Date(this.parametrosBusqueda.desde);
      this.listarBodegas();
      this.iniciarBusqueda();
    }
    let tamanio = this.isModal ? "313px" : "203px"
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - ' + tamanio + ')'
    }
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirKardex') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarKardex') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarKardex') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarKardex') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  iniciarBusqueda() {
    this.activar = false;
    this.cargando = false;
    this.buscarKardex();
  }

  listarBodegas() {
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, inactivo: false };
    if (this.isModal) {
      parametro.empresa = this.parametrosBusqueda.empresa;
    }
    this.bodegaService.listarInvListaBodegasTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvListaBodegasTO(data) {
    this.listaBodegas = data ? data : new Array();
    this.cargando = false;
  }

  limpiarResultado() {
    this.gridApi = null;
    this.vistaFormulario = false;
    this.gridColumnApi = null;
    this.listadoResultado = [];
    this.objetoSeleccionado = new InvKardexTO();
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  cerrarKardex() {
    this.enviarCancelar.emit(true);
  }

  //Revisar
  cambiarActivar() {
    this.activar = !this.activar;
    this.enviarActivar.emit(this.activar);
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.kardexService.generarColumnasKardex(this.parametrosBusqueda.vista, this, this.isModal);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
      iconoEstado: IconoEstadoComponent
    };
    this.components = {};
    this.rowClassRules = {
      'tr-negrita': function (params) {
        var estado = params.data.kTransaccion;
        return estado === 'SALDO INICIAL' || estado === 'Totales -->';
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.gridApi.sizeColumnsToFit();
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      // scrolls to the first column
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      // sets focus into the first grid cell
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  generarOpciones() {
    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: true,
      },
      {
        label: LS.ACCION_DESMAYORIZAR,
        icon: LS.ICON_DESMAYORIZAR,
        disabled: true,
      },
      {
        label: LS.ACCION_MAYORIZAR,
        icon: LS.ICON_MAYORIZAR,
        disabled: true,
      },
      {
        label: LS.ACCION_ANULAR,
        icon: LS.ICON_ANULAR,
        disabled: true,
      },
      {
        label: LS.ACCION_RESTAURAR,
        icon: LS.ICON_RESTAURAR,
        disabled: true,
      }
    ];
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    if (this.objetoSeleccionado.kTransaccion === 'VENTA') {
      this.generarOpcionesVenta();
    } else {
      if (this.objetoSeleccionado.kTransaccion === 'CONSUMO') {
        this.generarOpcionesConsumo();
      } else {
        if (this.objetoSeleccionado.kTransaccion === 'TRANS+' || this.objetoSeleccionado.kTransaccion === 'TRANS-') {
          this.generarOpcionesTransferencia();
        } if (this.objetoSeleccionado.kTransaccion === 'COMPRA') {
          this.generarOpcionesCompras();
        }
      }
    }
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  //Operaciones
  buscarKardex() {
    this.cargando = true;
    this.limpiarResultado();
    if (this.isModal) {
      this.parametrosBusqueda.desde = this.utilService.formatearDateToStringDDMMYYYY(this.fechaDesde);
      this.parametrosBusqueda.hasta = this.utilService.formatearDateToStringDDMMYYYY(this.fechaHasta);
      this.parametrosBusqueda.bodega = this.parametrosBusqueda.bodega ? this.parametrosBusqueda.bodega : null;
    }
    this.filasTiempo.iniciarContador();
    this.kardexService.getListaInvKardexTO(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetListaInvKardexTO(data) {
    this.filasTiempo.finalizarContador();
    this.listadoResultado = data && data.length > 0 ? data : [];
    this.enviarMostrarBtnRegresarFormulario.emit(data && data.length > 0 ? false : true);
    this.cargando = false;
    this.iniciarAgGrid();
    this.iniciarAtajos();
  }

  imprimirKardex() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        listInvKardexTO: this.listadoResultado,
        fechaDesde: this.parametrosBusqueda.desde,
        fechaHasta: this.parametrosBusqueda.hasta,
        nombreProducto: this.datos.nombreProducto,
        banderaCosto: this.parametrosBusqueda.vista === 'kardexValorizado' ? true : false
      };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteInvKardex", parametros, this.empresaSeleccionada)
        .then(respuesta => {
          if (respuesta._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('ListadoKardex' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
          } else {
            this.toastr.warning(LS.MSJ_NO_REPORTE_ERRORES);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarKardex() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        listInvKardexTO: this.listadoResultado,
        fechaDesde: this.parametrosBusqueda.desde,
        fechaHasta: this.parametrosBusqueda.hasta,
        nombreProducto: this.datos.nombreProducto,
        banderaCosto: this.parametrosBusqueda.vista === 'kardexValorizado' ? true : false
      };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteInvKardex", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, "ListadoKardex_");
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //VENTA
  generarOpcionesVenta() {
    let perConsultar = this.objetoSeleccionado.kTransaccion === 'VENTA';
    let perDesmayorizar = this.objetoSeleccionado.kTransaccion === 'VENTA' && this.ventaService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this.empresaSeleccionada) && (!this.objetoSeleccionado.kStatus || this.objetoSeleccionado.kStatus === " ");
    let perMayorizar = this.objetoSeleccionado.kTransaccion === 'VENTA' && this.ventaService.verificarPermiso(LS.ACCION_MAYORIZAR, this.empresaSeleccionada) && this.objetoSeleccionado.kStatus === LS.ETIQUETA_PENDIENTE;
    let perAnular = this.objetoSeleccionado.kTransaccion === 'VENTA' && this.ventaService.verificarPermiso(LS.ACCION_ANULAR, this.empresaSeleccionada) && this.objetoSeleccionado.kStatus !== LS.ETIQUETA_PENDIENTE && this.objetoSeleccionado.kStatus !== LS.ETIQUETA_ANULADO;
    let perRestaurar = this.objetoSeleccionado.kTransaccion === 'VENTA' && this.ventaService.verificarPermiso(LS.ACCION_RESTAURAR, this.empresaSeleccionada) && this.objetoSeleccionado.kStatus === LS.ETIQUETA_ANULADO;

    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.emitirAccion(LS.ACCION_CONSULTAR) : null
      },
      {
        label: LS.ACCION_DESMAYORIZAR,
        icon: LS.ICON_DESMAYORIZAR,
        disabled: !perDesmayorizar,
        command: () => perDesmayorizar ? this.desmayorizar() : null
      },
      {
        label: LS.ACCION_MAYORIZAR,
        icon: LS.ICON_MAYORIZAR,
        disabled: !perMayorizar,
        command: () => perMayorizar ? this.emitirAccion(LS.ACCION_MAYORIZAR) : null
      },
      {
        label: LS.ACCION_ANULAR,
        icon: LS.ICON_ANULAR,
        disabled: !perAnular,
        command: () => perAnular ? this.emitirAccion(LS.ACCION_ANULAR) : null
      },
      {
        label: LS.ACCION_RESTAURAR,
        icon: LS.ICON_RESTAURAR,
        disabled: !perRestaurar,
        command: () => perRestaurar ? this.emitirAccion(LS.ACCION_RESTAURAR) : null
      }
    ];
  }

  ejecutarAccion(event) {
    switch (event.accion) {
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
      case LS.ACCION_CREADO:
        this.parametrosBusqueda.incluirTodos = true;
        this.buscarKardex();
        this.cancelar();
        break;
    }
  }

  emitirAccion(accion) {
    let venta = new InvListaConsultaVentaTO();
    venta.vtaStatus = this.objetoSeleccionado.kStatus;
    venta.vtaDocumentoNumero = this.objetoSeleccionado.kDocumentoNumero.split("|")[1].trim();
    venta.vtaDocumentoTipo = this.objetoSeleccionado.kDocumentoNumero.split("|")[0].trim();
    venta.vtaNumero = this.objetoSeleccionado.kNumeroSistema;
    this.tipoDocumento = venta.vtaDocumentoTipo;
    this.parametrosFormulario = {
      accion: accion,
      seleccionado: venta,
      listadoPeriodos: this.parametrosBusqueda && this.parametrosBusqueda.listaPeriodos ? this.parametrosBusqueda.listaPeriodos : []
    }
    this.vistaFormulario = true;
    this.mostrandoFormulario.emit(true);
  }

  desmayorizar() {
    let parametros = {
      title: LS.VENTA + " " + this.objetoSeleccionado.kNumeroSistema,
      texto: LS.MSJ_PREGUNTA_DESMAYORIZAR,
      type: LS.SWAL_QUESTION,
      confirmButtonText: "<i class='" + LS.ICON_DESMAYORIZAR + "'></i>  " + LS.ACCION_DESMAYORIZAR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        let parametro = {
          empresa: LS.KEY_EMPRESA_SELECT,
          numeroDocumento: this.objetoSeleccionado.kDocumentoNumero.split("|")[1].trim(),
          tipoDocumento: this.objetoSeleccionado.kDocumentoNumero.split("|")[0].trim()
        };
        this.cargando = true;
        this.ventaService.desmayorizarVenta(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeDesmayorizarVenta(data) {
    this.objetoSeleccionado.kStatus = "PENDIENTE";
    let venta = new InvListaConsultaVentaTO();
    venta.vtaStatus = this.objetoSeleccionado.kStatus;
    venta.vtaDocumentoNumero = this.objetoSeleccionado.kDocumentoNumero.split("|")[1].trim();
    venta.vtaDocumentoTipo = this.objetoSeleccionado.kDocumentoNumero.split("|")[0].trim();
    venta.vtaObservaciones = this.objetoSeleccionado.kObservaciones;
    venta.vtaFecha = this.objetoSeleccionado.kFecha;
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: data.operacionMensaje + '<br>' + LS.MSJ_PREGUNTA_MAYORIZAR,
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_MAYORIZAR + "'></i>  " + LS.ACCION_MAYORIZAR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona MAYORIZAR
        this.cargando = false;
        this.parametrosBusqueda.incluirTodos = true;
        this.buscarKardex();
        this.emitirAccion(LS.ACCION_MAYORIZAR);
      } else {//Cierra el formulario
        this.parametrosBusqueda.incluirTodos = true;
        this.buscarKardex();
        this.cargando = false;
      }
    });
  }

  //CONSUMO
  generarOpcionesConsumo() {
    let perConsultar = this.objetoSeleccionado.kTransaccion === 'CONSUMO';
    let perDesmayorizar = this.objetoSeleccionado.kTransaccion === 'CONSUMO' && this.consumoService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this.empresaSeleccionada) && (!this.objetoSeleccionado.kStatus || this.objetoSeleccionado.kStatus === " ");
    let perMayorizar = this.objetoSeleccionado.kTransaccion === 'CONSUMO' && this.consumoService.verificarPermiso(LS.ACCION_MAYORIZAR, this.empresaSeleccionada) && this.objetoSeleccionado.kStatus === LS.ETIQUETA_PENDIENTE;
    let perAnular = this.objetoSeleccionado.kTransaccion === 'CONSUMO' && this.consumoService.verificarPermiso(LS.ACCION_ANULAR, this.empresaSeleccionada) && this.objetoSeleccionado.kStatus !== LS.ETIQUETA_PENDIENTE && this.objetoSeleccionado.kStatus !== LS.ETIQUETA_ANULADO;
    let perRestaurar = this.objetoSeleccionado.kTransaccion === 'CONSUMO' && this.consumoService.verificarPermiso(LS.ACCION_RESTAURAR, this.empresaSeleccionada) && this.objetoSeleccionado.kStatus === LS.ETIQUETA_ANULADO;

    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR_CONSUMO,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.emitirAccionConsumos(LS.ACCION_CONSULTAR) : null
      },
      {
        label: LS.ACCION_DESMAYORIZAR,
        icon: LS.ICON_DESMAYORIZAR,
        disabled: !perDesmayorizar,
        command: () => perDesmayorizar ? this.desmayorizarConsumo() : null
      },
      {
        label: LS.ACCION_MAYORIZAR,
        icon: LS.ICON_MAYORIZAR,
        disabled: !perMayorizar,
        command: () => perMayorizar ? this.emitirAccionConsumos(LS.ACCION_MAYORIZAR) : null
      },
      {
        label: LS.ACCION_ANULAR,
        icon: LS.ICON_ANULAR,
        disabled: !perAnular,
        command: () => perAnular ? this.emitirAccionConsumos(LS.ACCION_ANULAR) : null
      },
      {
        label: LS.ACCION_RESTAURAR,
        icon: LS.ICON_RESTAURAR,
        disabled: !perRestaurar,
        command: () => perRestaurar ? this.emitirAccionConsumos(LS.ACCION_RESTAURAR) : null
      }
    ];
  }

  ejecutarAccionConsumos(event) {
    switch (event.accion) {
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
      case LS.ACCION_CREADO:
        this.parametrosBusqueda.incluirTodos = true;
        this.buscarKardex();
        this.cancelar();
        break;
    }
  }

  emitirAccionConsumos(accion) {
    let consumo = new InvListaConsultaConsumosTO();
    consumo.consFecha = this.objetoSeleccionado.kFecha;
    consumo.consNumero = this.objetoSeleccionado.kNumeroSistema;
    consumo.consObservaciones = this.objetoSeleccionado.kObservaciones;
    consumo.consStatus = this.objetoSeleccionado.kStatus;
    this.parametrosFormularioConsumo = {
      accion: accion,
      seleccionado: consumo,
    }
    this.vistaFormulario = true;
    this.mostrandoFormulario.emit(true);
  }

  desmayorizarConsumo() {
    let comprobante: Array<string> = this.objetoSeleccionado.kNumeroSistema.split("|");
    let periodo = comprobante[0].trim();
    let motivo = comprobante[1].trim();
    let numero = comprobante[2].trim();
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      periodo: periodo,
      motivo: motivo,
      numero: numero
    }
    this.cargando = true;
    this.consumoService.desmayorizarConsumo(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeDesmayorizarConsumo(data) {
    this.objetoSeleccionado.kStatus = "PENDIENTE";
    let consumo = new InvListaConsultaConsumosTO();
    consumo.consStatus = this.objetoSeleccionado.kStatus;
    consumo.consNumero = this.objetoSeleccionado.kDocumentoNumero;
    consumo.consObservaciones = this.objetoSeleccionado.kObservaciones;
    consumo.consFecha = this.objetoSeleccionado.kFecha;
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: data.operacionMensaje + '<br>' + LS.MSJ_PREGUNTA_MAYORIZAR,
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_MAYORIZAR + "'></i>  " + LS.ACCION_MAYORIZAR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = false;
        this.parametrosBusqueda.incluirTodos = true;
        this.buscarKardex();
        this.emitirAccionConsumos(LS.ACCION_MAYORIZAR);
      } else {//Cierra el formulario
        this.parametrosBusqueda.incluirTodos = true;
        this.buscarKardex();
        this.cargando = false;
      }
    });
  }

  //TRANSFERENCIAS
  generarOpcionesTransferencia() {
    let perConsultar = this.objetoSeleccionado.kTransaccion === 'TRANS+' || this.objetoSeleccionado.kTransaccion === 'TRANS-';
    let perDesmayorizar = (this.objetoSeleccionado.kTransaccion === 'TRANS+' || this.objetoSeleccionado.kTransaccion === 'TRANS-') && this.transferenciasService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this.empresaSeleccionada) && (!this.objetoSeleccionado.kStatus || this.objetoSeleccionado.kStatus === " ");
    let perMayorizar = (this.objetoSeleccionado.kTransaccion === 'TRANS+' || this.objetoSeleccionado.kTransaccion === 'TRANS-') && this.transferenciasService.verificarPermiso(LS.ACCION_MAYORIZAR, this.empresaSeleccionada) && this.objetoSeleccionado.kStatus === LS.ETIQUETA_PENDIENTE;
    let perAnular = (this.objetoSeleccionado.kTransaccion === 'TRANS+' || this.objetoSeleccionado.kTransaccion === 'TRANS-') && this.transferenciasService.verificarPermiso(LS.ACCION_ANULAR, this.empresaSeleccionada) && this.objetoSeleccionado.kStatus !== LS.ETIQUETA_PENDIENTE && this.objetoSeleccionado.kStatus !== LS.ETIQUETA_ANULADO;
    let perRestaurar = (this.objetoSeleccionado.kTransaccion === 'TRANS+' || this.objetoSeleccionado.kTransaccion === 'TRANS-') && this.transferenciasService.verificarPermiso(LS.ACCION_RESTAURAR, this.empresaSeleccionada) && this.objetoSeleccionado.kStatus === LS.ETIQUETA_ANULADO;

    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR_TRANSFERENCIA,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.operacionTransferenciaListado(LS.ACCION_CONSULTAR, perConsultar) : null
      },
      {
        label: LS.ACCION_DESMAYORIZAR,
        icon: LS.ICON_DESMAYORIZAR,
        disabled: !perDesmayorizar,
        command: () => perDesmayorizar ? this.desmayorizarTransferencia() : null
      },
      {
        label: LS.ACCION_MAYORIZAR,
        icon: LS.ICON_MAYORIZAR,
        disabled: !perMayorizar,
        command: () => perMayorizar ? this.operacionTransferenciaListado(LS.ACCION_MAYORIZAR, perMayorizar) : null
      },
      {
        label: LS.ACCION_ANULAR,
        icon: LS.ICON_ANULAR,
        disabled: !perAnular,
        command: () => perAnular ? this.operacionTransferenciaListado(LS.ACCION_ANULAR, perAnular) : null
      },
      {
        label: LS.ACCION_RESTAURAR,
        icon: LS.ICON_RESTAURAR,
        disabled: !perRestaurar,
        command: () => perRestaurar ? this.operacionTransferenciaListado(LS.ACCION_RESTAURAR, perRestaurar) : null
      }
    ];
  }

  ejecutarAccionTransferencia(event) {
    switch (event.accion) {
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
      case LS.ACCION_CREADO:
      case LS.ACCION_MODIFICADO:
      case LS.ACCION_DESMAYORIZAR:
        this.parametrosBusqueda.incluirTodos = true;
        this.buscarKardex();
        this.cancelar();
        break;
    }
  }

  operacionTransferenciaListado(accion, tienePermiso) {
    if (tienePermiso) {
      this.vistaFormulario = true;
      this.mostrandoFormulario.emit(true);
      this.parametrosFormularioTransferencia = {
        accion: accion,
        transferencia: this.objetoSeleccionado.kNumeroSistema,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        volverACargar: false
      };
    }
  }

  desmayorizarTransferencia() {
    let itemTransferencia: Array<string> = this.objetoSeleccionado.kNumeroSistema.split("|");
    let periodo = itemTransferencia[0].trim();
    let motivo = itemTransferencia[1].trim();
    let numero = itemTransferencia[2].trim();
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      periodo: periodo,
      motivo: motivo,
      numero: numero
    }
    this.cargando = true;
    this.transferenciasService.desmayorizarTransferencias(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeDesmayorizarTransferencia(data) {
    this.objetoSeleccionado.kStatus = "PENDIENTE";
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: data.extraInfo + '<br>' + LS.MSJ_PREGUNTA_MAYORIZAR,
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_MAYORIZAR + "'></i>  " + LS.ACCION_MAYORIZAR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {
        this.cargando = false;
        let perMayorizar = this.transferenciasService.verificarPermiso(LS.ACCION_MAYORIZAR, this.empresaSeleccionada) && this.objetoSeleccionado.kStatus === "PENDIENTE";
        this.parametrosBusqueda.incluirTodos = true;
        this.buscarKardex();
        this.operacionTransferenciaListado(LS.ACCION_MAYORIZAR, perMayorizar);
      } else {
        this.parametrosBusqueda.incluirTodos = true;
        this.buscarKardex();
        this.cargando = false;
      }
    });
  }

  //COMPRAS
  generarOpcionesCompras() {
    let perConsultar = this.objetoSeleccionado.kTransaccion === 'COMPRA';
    let perDesmayorizar = this.objetoSeleccionado.kTransaccion === 'COMPRA' && this.comprasService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this, true) && (!this.objetoSeleccionado.kStatus || this.objetoSeleccionado.kStatus === " ");
    let perMayorizar = this.objetoSeleccionado.kTransaccion === 'COMPRA' && this.comprasService.verificarPermiso(LS.ACCION_MAYORIZAR, this, true) && this.objetoSeleccionado.kStatus === LS.ETIQUETA_PENDIENTE;
    let perAnular = this.objetoSeleccionado.kTransaccion === 'COMPRA' && this.comprasService.verificarPermiso(LS.ACCION_ANULAR, this, true) && this.objetoSeleccionado.kStatus !== LS.ETIQUETA_PENDIENTE && this.objetoSeleccionado.kStatus !== LS.ETIQUETA_ANULADO;
    let perRestaurar = this.objetoSeleccionado.kTransaccion === 'COMPRA' && this.comprasService.verificarPermiso(LS.ACCION_RESTAURAR, this, true) && this.objetoSeleccionado.kStatus === LS.ETIQUETA_ANULADO;
    let perCambFecha = this.objetoSeleccionado.kTransaccion === 'COMPRA' && this.comprasService.verificarPermiso(LS.ACCION_CREAR, this, true) && (!this.objetoSeleccionado.kStatus || this.objetoSeleccionado.kStatus === " ");
    this.opciones = [
      { label: LS.ACCION_CONSULTAR_COMPRA, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: () => perConsultar ? this.emitirAccionCompras(LS.ACCION_CONSULTAR) : null },
      { label: LS.ACCION_DESMAYORIZAR, icon: LS.ICON_DESMAYORIZAR, disabled: !perDesmayorizar, command: () => perDesmayorizar ? this.desmayorizarCompras() : null },
      { label: LS.ACCION_MAYORIZAR, icon: LS.ICON_MAYORIZAR, disabled: !perMayorizar, command: () => perMayorizar ? this.emitirAccionCompras(LS.ACCION_MAYORIZAR) : null },
      { label: LS.ACCION_ANULAR, icon: LS.ICON_ANULAR, disabled: !perAnular, command: () => perAnular ? this.emitirAccionCompras(LS.ACCION_ANULAR) : null },
      { label: LS.ACCION_RESTAURAR, icon: LS.ICON_RESTAURAR, disabled: !perRestaurar, command: () => perRestaurar ? this.emitirAccionCompras(LS.ACCION_RESTAURAR) : null },
      { label: LS.ACCION_CAMBIAR_FECHA_RECEPCION, icon: LS.ICON_EDITAR, disabled: !perCambFecha, command: () => perCambFecha ? this.cambiarFechaRecepcion() : null }
    ];
  }

  ejecutarAccionCompras(event) {
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.cambiarActivar();
        break;
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
    }
  }

  emitirAccionCompras(accion) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      let itemCompra: Array<string> = this.objetoSeleccionado.kNumeroSistema.split("|");
      let periodo: Array<string> = itemCompra[0].split(' ');
      let motivo: Array<string> = itemCompra[1].split(' ');
      let numero: Array<string> = itemCompra[2].split(' ');
      this.parametrosCompra = {
        accion: accion,
        parametroBusqueda: {
          empresa: this.empresaSeleccionada.empCodigo,
          periodo: periodo[0],
          motivo: motivo[1],
          numero: numero[1]
        }
      };
      this.vistaFormulario = true;
      this.mostrandoFormulario.emit(true);
    }
  }

  desmayorizarCompras() {
    if (this.objetoSeleccionado.kNumeroSistema) {
      this.cargando = true;
      let itemCompra: Array<string> = this.objetoSeleccionado.kNumeroSistema.split("|");
      let periodo: Array<string> = itemCompra[0].split(' ');
      let motivo: Array<string> = itemCompra[1].split(' ');
      let numero: Array<string> = itemCompra[2].split(' ');
      let pk = new InvComprasPK({
        compEmpresa: this.empresaSeleccionada.empCodigo,
        compPeriodo: periodo[0],
        compMotivo: motivo[1],
        compNumero: numero[1]
      });
      this.comprasService.desmayorizarCompra({ invComprasPK: pk }, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeDesmayorizarCompra(respuesta) {
    this.objetoSeleccionado.kStatus = "PENDIENTE";
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: respuesta.operacionMensaje + '<br>' + LS.MSJ_PREGUNTA_MAYORIZAR,
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_MAYORIZAR + "'></i>  " + LS.ACCION_MAYORIZAR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {
        this.cargando = false;
        this.parametrosBusqueda.incluirTodos = true;
        this.emitirAccionCompras(LS.ACCION_MAYORIZAR);
      } else {
        this.parametrosBusqueda.incluirTodos = true;
        this.buscarKardex();
        this.cargando = false;
      }
    });
  }

  cambiarFechaRecepcion() {
    if (this.objetoSeleccionado.kNumeroSistema) {
      let itemCompra: Array<string> = this.objetoSeleccionado.kNumeroSistema.split("|");
      let periodo: Array<string> = itemCompra[0].split(' ');
      let motivo: Array<string> = itemCompra[1].split(' ');
      let numero: Array<string> = itemCompra[2].split(' ');
      let parametros = {
        empresa: LS.KEY_EMPRESA_SELECT,
        periodo: periodo[0],
        motivo: motivo[1],
        numero: numero[1]
      };
      const modalRef = this.modalService.open(CambiarFechaRecepcionComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.parametros = parametros;
      modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
      modalRef.result.then((result) => {
        if (result && result.esFechaValido) {
          this.refrescarTabla(result.datosCambiarFecha);
          this.iniciarAtajos();
        }
      }, () => {
        this.iniciarAtajos();
      });
    } else {
      this.toastr.warning(LS.MSJ_INGRESE_DATOS_VALIDOS, LS.TAG_AVISO);
    }
  }

  refrescarTabla(invKardex: InvComprasRecepcionTO) {
    let invKardexPk = this.convertirComprasAKardex(invKardex);
    var indexTemp = this.listadoResultado.findIndex(item => item.kNumeroSistema === invKardexPk.kNumeroSistema);
    let listaTemporal = [... this.listadoResultado];
    listaTemporal[indexTemp] = invKardexPk;
    this.listadoResultado = listaTemporal;
    this.objetoSeleccionado = this.listadoResultado[indexTemp];
  }

  convertirComprasAKardex(invKardex: InvComprasRecepcionTO): InvKardexTO {
    //2018-04 | 101 | 0000065
    let objeto: InvKardexTO = new InvKardexTO();
    objeto.id = this.objetoSeleccionado.id;
    objeto.kCostoActual = this.objetoSeleccionado.kCostoActual;
    objeto.kBodega = this.objetoSeleccionado.kBodega;
    objeto.kDocumentoNumero = this.objetoSeleccionado.kDocumentoNumero;
    objeto.kEntradasCantidad = this.objetoSeleccionado.kEntradasCantidad;
    objeto.kEntradasCosto = this.objetoSeleccionado.kEntradasCosto;
    objeto.kFecha = invKardex.recepFecha;
    objeto.kNumeroSistema = invKardex.compPeriodo + " | " + invKardex.compMotivo + " | " + invKardex.compNumero;
    objeto.kObservaciones = this.objetoSeleccionado.kObservaciones;
    objeto.kProveedor = this.objetoSeleccionado.kProveedor;
    objeto.kSaldosCantidad = this.objetoSeleccionado.kSaldosCantidad;
    objeto.kSaldosCosto = this.objetoSeleccionado.kSaldosCosto;
    objeto.kSalidasCantidad = this.objetoSeleccionado.kSalidasCantidad;
    objeto.kSalidasCosto = this.objetoSeleccionado.kSalidasCosto;
    objeto.kSectorPiscina = this.objetoSeleccionado.kSectorPiscina;
    objeto.kStatus = this.objetoSeleccionado.kStatus;
    objeto.kTransaccion = this.objetoSeleccionado.kTransaccion;
    return objeto;
  }

  //METODOS QUE TODOS USAN
  consultar() {
    let opcion = this.objetoSeleccionado.kTransaccion;
    switch (opcion) {
      case "VENTA": {
        this.emitirAccion(LS.ACCION_CONSULTAR);
        break;
      }
      case "CONSUMO": {
        this.emitirAccionConsumos(LS.ACCION_CONSULTAR);
        break;
      }
      case "TRANS+":
      case "TRANS-": {
        this.operacionTransferenciaListado(LS.ACCION_CONSULTAR, true);
        break;
      }
      case "COMPRA": {
        this.emitirAccionCompras(LS.ACCION_CONSULTAR);
      }
      default: {
        break;
      }
    }
  }

  cancelar() {
    this.iniciarAtajos();
    this.vistaFormulario = false;
    this.parametrosFormulario = null;
    this.parametrosFormularioConsumo = null;
    this.parametrosFormularioTransferencia = null;
    this.parametrosCompra = null;
    this.mostrandoFormulario.emit(false);
  }
}
