import { Component, OnInit, Input, Output, EventEmitter, HostListener, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { InvPedidosDetalle } from '../../../../entidades/inventario/InvPedidosDetalle';
import { InvPedidos } from '../../../../entidades/inventario/InvPedidos';
import { InvPedidosMotivo } from '../../../../entidades/inventario/InvPedidosMotivo';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvPedidosConfiguracionTO } from '../../../../entidadesTO/inventario/InvPedidosConfiguracionTO';
import { InvPedidosPK } from '../../../../entidades/inventario/InvPedidosPK';
import { InvPedidosMotivoPK } from '../../../../entidades/inventario/InvPedidosMotivoPK';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { GridApi } from 'ag-grid';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KardexListadoComponent } from '../../../inventario/componentes/kardex-listado/kardex-listado.component';
import { PopOverInformacionComponent } from '../../../componentes/pop-over-informacion/pop-over-informacion.component';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { Contacto } from '../../../../entidadesTO/inventario/Contacto';
import { OrdenPedidoService } from '../../transacciones/generar-orden-pedido/orden-pedido.service';

@Component({
  selector: 'app-detalle-pedido-para-orden-compra',
  templateUrl: './detalle-pedido-para-orden-compra.component.html'
})
export class DetallePedidoParaOrdenCompraComponent implements OnInit {

  @Input() data: any;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Output() enviarCancelar: EventEmitter<any> = new EventEmitter();
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  @Output() enviarLista: EventEmitter<any> = new EventEmitter();
  @Output() enviarAccion: EventEmitter<any> = new EventEmitter();
  public accion = null;//Bandera
  public constantes: any; //Referencia a las constantes
  public isScreamMd: boolean; //Bandera para indicar el tamaño de la pantalla
  public es: any = {}; //Locale Date (Obligatoria)
  public cargando: boolean = false;
  public activar: boolean = false;
  public frmTitulo: String; //Titulo de formulario
  public vistaFormulario = false;
  public paraOrdenCompra = true;
  public invPedidos: InvPedidos = new InvPedidos(); //Objeto de Orden de pedido
  public pedidoEstado: string = "";
  public registradorAprobadorIgual: boolean = false;
  //[CAMPOS DE ORDEN DE PEDIDO]
  public usrRegistradorNombre: String;
  public usrAprobadorNombre: String;
  public usrEjecutorNombre: String;
  public fechaActual: Date = new Date();
  public configuracion: InvPedidosConfiguracionTO;
  public funcionesUsuario: Array<string> = [];//Funciones del usuario actual
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public motivoSeleccionado: InvPedidosMotivo;
  //[ELEMENTOS DE LA ORDEN DE COMPRA]
  public dataFormularioCompra: any = null;//Objeto a enviar para generar la orden de compra
  //AG-GRID
  public listadoResultado: Array<InvPedidosDetalle> = [];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public rowSelection: string;
  public context;
  public frameworkComponents;
  public rowClassRules;
  public isAprobador: boolean = false;
  public isCollapsed: boolean = true;
  public estilos: any = {};
  public parametro: any = {};
  //CLIENTE
  public isCollapseCliente: boolean = true;
  public clienteCodigo: string = null;
  public contactoPredeterminado: Contacto = new Contacto();
  public arrayLugarEntrega = [];
  public indiceDeContactoPredeterminado: number = 0;

  constructor(
    private api: ApiRequestService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private atajoService: HotkeysService,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private ordenPedidoService: OrdenPedidoService,
    private sistemaService: AppSistemaService,
    private modalService: NgbModal
  ) {
    this.constantes = LS; //Hace referncia a los constantes
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - 410px)',
      'min-height': '135px'
    }
  }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.iniciarAtajos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.iniciarFormulario();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarFormOrdenPedido') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      this.cancelarAccion();
      return false;
    }));
  }

  iniciarFormulario() {
    if (this.empresaSeleccionada && this.data && this.data.accion && this.data.invPedidosPK) {
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.accion = this.data.accion;
      // this.iniciarAgGrid();
      this.obtenerDatosParaGenerarOP();
    }
  }

  consultarOrdenesCompra(detalle) {
    let detSecuencial = detalle.detSecuencial;
    this.dataFormularioCompra = { accion: LS.ACCION_CARRITO, detSecuencial: detSecuencial };
    this.enviarAccion.emit(this.dataFormularioCompra);
  }

  obtenerDatosParaGenerarOP() {
    this.cargando = true;
    let invPedidosMotivo = new InvPedidosMotivoPK();
    invPedidosMotivo.pmEmpresa = this.data.invPedidosPK.pedEmpresa;
    invPedidosMotivo.pmCodigo = this.data.invPedidosPK.pedMotivo;
    invPedidosMotivo.pmSector = this.data.invPedidosPK.pedSector;
    let parametro = { invPedidosMotivoPK: invPedidosMotivo };
    this.ordenPedidoService.obtenerDatosParaGenerarOP(parametro, this, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        respuesta ? this.formatearDatosIniciarAccion(respuesta) : this.cerrarFormulario();
      }).catch(err => this.utilService.handleError(err, this));
  }

  cerrarFormulario() {
    this.enviarCancelar.emit();
  }

  formatearDatosIniciarAccion(respuesta) {
    this.fechaActual = new Date(respuesta.fechaActual);
    this.fechaActual.setUTCSeconds(0);
    //Formatear configuracion de pedido
    this.configuracion = respuesta.invPedidosConfiguracionTO;
    this.funcionesUsuario = this.ordenPedidoService.establecerFuncionesUsuario(this.configuracion);
    //Formatear motivo de pedido
    this.motivoSeleccionado = new InvPedidosMotivo(respuesta.invPedidosMotivo);
    //Comienza a verificar los permisos de acuerdo a la accion
    this.realizarAccion();
  }

  realizarAccion() {
    if (this.ordenPedidoService.verificarPermiso(this.accion, this, true)) {
      switch (this.accion) {
        case LS.ACCION_CONSULTAR: {
          this.frmTitulo = LS.PEDIDOS_CONSULTAR;
          this.obtenerInvPedidos();
          break;
        }
        case LS.ACCION_ELIMINAR: {
          this.frmTitulo = LS.PEDIDOS_ELIMINAR;
          this.obtenerInvPedidos();
          break;
        }
      }
    }
    this.iniciarAgGrid();
  }

  establecerResponsables() {
    this.usrRegistradorNombre = this.data.invPedidoTO ? this.data.invPedidoTO.registrador : "S/D";
    this.usrAprobadorNombre = this.invPedidos.pedAprobado && this.data.invPedidoTO ? this.data.invPedidoTO.aprobador : "S/D";
    this.usrEjecutorNombre = this.invPedidos.pedEjecutado && this.data.invPedidoTO ? this.data.invPedidoTO.ejecutor : "S/D";
    this.registradorAprobadorIgual = this.usrRegistradorNombre === this.usrAprobadorNombre;
  }

  /** Imprimir orden de pedido */
  imprimirInvPedidos(close?) {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      this.pedidoEstado = this.ordenPedidoService.getEstadoInvPedidos(this.invPedidos);
      let invPedidosCopia = this.ordenPedidoService.establecerFormatoEnvioIvPedidos(this.invPedidos, this.pedidoEstado);
      if (invPedidosCopia.invPedidosDetalleList.length === 0) {
        this.toastr.warning(LS.MSJ_NO_DATOS_IMPRIMIR, LS.TAG_AVISO);
        this.cargando = false;
        return;
      }
      let parametro = { invPedidosPK: new InvPedidosPK(this.invPedidos.invPedidosPK), nombreReporte: LS.NOMBRE_REPORTE_APROBAR_ORDEN_PEDIDO };
      this.archivoService.postPDF("todocompuWS/pedidosWebController/generarReporteInvPedidosGeneral", parametro, this.empresaSeleccionada)
        .then(respuesta => {
          if (respuesta._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('ordenDePedido ' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR);
          }
          if (close) {
            this.cancelarAccion();
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  /** Exportar orden de pedido */
  exportarInvPedidos() {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      this.pedidoEstado = this.ordenPedidoService.getEstadoInvPedidos(this.invPedidos);
      let invPedidosCopia = this.ordenPedidoService.establecerFormatoEnvioIvPedidos(this.invPedidos, this.pedidoEstado);
      if (invPedidosCopia.invPedidosDetalleList.length === 0) {
        this.toastr.warning(LS.MSJ_NO_DATOS_EXPORTAR, LS.TAG_AVISO);
        this.cargando = false;
        return;
      }
      let parametro = { invPedidosPK: new InvPedidosPK(this.invPedidos.invPedidosPK) };
      this.archivoService.postExcel("todocompuWS/pedidosWebController/exportarReporteInvPedidos", parametro, this.empresaSeleccionada)
        .then(respuesta => {
          if (respuesta) {
            this.utilService.descargarArchivoExcel(respuesta._body, 'OrdenPedido_');
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA);
          }
          this.cargando = false;
        })
        .catch(err => this.utilService.handleError(err, this));
    }
  }

  /** Eliminar orden de pedido */
  eliminarOrdenPedido() {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametro = { invPedidosPK: new InvPedidosPK(this.invPedidos.invPedidosPK) };
          this.api.post("todocompuWS/pedidosWebController/eliminarInvPedidos", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
                this.enviarLista.emit({ objeto: this.ordenPedidoService.crearInvPedidoTODeInvPedidos(this.invPedidos, this.configuracion, this.motivoSeleccionado), accion: LS.LST_ELIMINAR });
              } else {
                this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
              }
              this.cargando = false;
            }).catch(err => this.utilService.handleError(err, this));
        }
      });
    }
  }

  cambiarActivar(activar?) {
    this.activar = !activar ? !this.activar : activar;
    this.enviarActivar.emit({ 'activar': this.activar, 'deshabilitarOpciones': true, 'vistaListado': false });
  }

  /** Oculta el formulario y muestra la búsqueda. */
  cancelarAccion() {
    this.enviarCancelar.emit();
  }

  collpase() {
    this.isCollapsed = !this.isCollapsed;
    let tamanio = '';
    if (this.motivoSeleccionado.pmExigirCliente && this.invPedidos.invCliente) {
      tamanio = this.collapseAmbos();
    } else {
      tamanio = this.isCollapsed ? '410px' : '265px';
    }
    this.cambiarTamanioTabla(tamanio);
  }

  collpaseCliente() {
    this.isCollapseCliente = !this.isCollapseCliente;
    let tamanio = this.collapseAmbos();
    this.cambiarTamanioTabla(tamanio);
  }

  collapseAmbos(): string {
    let tamanio = (
      this.isCollapsed && this.isCollapseCliente ?
        '585px' : (
          !this.isCollapsed && !this.isCollapseCliente ?
            '305px' : (
              this.isCollapsed && !this.isCollapseCliente ? '445px' : '475px'
            )
        )
    );
    return tamanio;
  }

  cambiarTamanioTabla(tamanio) {
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - ' + tamanio + ')'
    }
  }

  soloNumeros(event) {
    return this.utilService.soloNumeros(event);
  }

  obtenerFechaServidor() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.invPedidos.pedFechaHoraEntrega = data[1];//Fecha inicio en la posicion 0
      }).catch(err => this.utilService.handleError(err, this));
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.ordenPedidoService.generarColumnasOrdenPedidoDetalle(this, this.accion);
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      popOverInformacion: PopOverInformacionComponent,
      botonAccion: BotonAccionComponent
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.gridApi.sizeColumnsToFit();
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
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
  //#endregion

  buscarKardex(detalle: InvPedidosDetalle) {
    if (detalle.invProducto.invProductoPK.proCodigoPrincipal && detalle.invProducto.invProductoPK.proCodigoPrincipal.length > 0) {
      let desde = new Date(this.utilService.obtenerFechaInicioMes());
      desde.setMonth(desde.getMonth() - 1);
      let parametroBusquedaProducto = {
        empresa: LS.KEY_EMPRESA_SELECT,
        bodega: null,
        producto: detalle.invProducto.invProductoPK.proCodigoPrincipal,
        desde: desde,
        hasta: this.utilService.formatearDateToStringDDMMYYYY(this.utilService.obtenerFechaFinMes()),
        promedio: LS.KEY_KARDEX_PROMEDIO,
        isModal: true
      };
      const modalRef = this.modalService.open(KardexListadoComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.parametrosBusqueda = parametroBusquedaProducto;
      modalRef.componentInstance.datos = { vista: 'produccion', empresaSeleccionada: this.empresaSeleccionada };
      modalRef.componentInstance.isModal = true;
      modalRef.result.then(() => {
        this.actualizarFilas();
      }, () => {
        this.actualizarFilas();
      });
    } else {
      this.toastr.info(LS.MSJ_SELECCIONE_PRODUCTO, LS.TOAST_INFORMACION)
    }
  }

  obtenerInvPedidos() {
    this.cargando = true;
    let parametro = { empresa: this.data.invPedidosPK.pedEmpresa, motivo: this.data.invPedidosPK.pedMotivo, numero: this.data.invPedidosPK.pedNumero, sector: this.data.invPedidosPK.pedSector };
    this.ordenPedidoService.obtenerOrdenPedido(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerOrdenPedido(data) {
    this.invPedidos = this.ordenPedidoService.establecerFormatoVistaIvPedidos(data);//Carga los datos
    this.pedidoEstado = this.ordenPedidoService.getEstadoInvPedidos(this.invPedidos);
    this.listadoResultado = this.invPedidos.invPedidosDetalleList;
    this.establecerResponsables();
    this.vistaFormulario = true;
    this.cambiarActivar(true);
    this.cargando = false;
    this.motivoSeleccionado.pmExigirCliente && this.invPedidos.invCliente ? this.estilos = { 'width': '100%', 'height': 'calc(100vh - 585px)' } : null;
    this.motivoSeleccionado.pmExigirCliente && this.invPedidos.invCliente ? this.clienteCodigo = this.invPedidos.invCliente.invClientePK.cliCodigo : null;
  }

  ejecutarAccion(data, accion) {
    if (accion === 'verKardex') {
      this.buscarKardex(data);
    }
    if (accion === 'consultarOrdenesCompra') {
      this.consultarOrdenesCompra(data);
    }
  }

}
