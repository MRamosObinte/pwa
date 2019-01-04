import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ViewChild, HostListener } from '@angular/core';
import { InvPedidoTO } from '../../../../entidadesTO/inventario/InvPedidoTO';
import { MenuItem } from 'primeng/api';
import { LS } from '../../../../constantes/app-constants';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { InvPedidosPK } from '../../../../entidades/inventario/InvPedidosPK';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import * as moment from 'moment';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import swal from 'sweetalert2';
import { OrdenPedidoService } from '../../transacciones/generar-orden-pedido/orden-pedido.service';

@Component({
  selector: 'app-listado-orden-pedido',
  templateUrl: './listado-orden-pedido.component.html'
})
export class ListadoOrdenPedidoComponent implements OnInit, OnChanges {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  @Input() parametrosBusqueda: any = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() operacion: any;
  @Input() filasTiempoRecargar: boolean = false;
  @Output() enviarCancelar: EventEmitter<any> = new EventEmitter();
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  @Output() enviarDatosOC: EventEmitter<any> = new EventEmitter();
  //[ELEMENTOS GENERALES]
  @ViewChild("excelDownload") excelDownload;
  public constantes: any; //Referencia a las constantes
  public opciones: MenuItem[] = []; //Listado de opciones que apareceran en la lista
  public isScreamMd: boolean; //Bandera para indicar el tamaño de la pantalla
  public es: any = {}; //Locale Date (Obligatoria)
  public activar: boolean = false;
  public cargando: boolean = false;
  public accion: string = null;
  //Cambian al mostrar u ocultar el listado
  public vistaListado: boolean = false;
  //[ELEMENTOS USADOS EN LA TABLA]
  public listadoResultado: Array<InvPedidoTO> = [];
  public objetoSeleccionado: InvPedidoTO = new InvPedidoTO(); //Objeto actualmente seleccionado
  //[ELEMENTOS DEL FORMULARIO ORDEN DE PEDIDO]
  public frmTitulo: string;
  public classTitulo: string;
  public dataFormularioPedido: any = null;
  public dataFormularioCompra: any = null;//Objeto a enviar para generar la orden de compra
  public mostrarFormularioAprobarOrden: boolean = false;
  public mostrarFormularioEjecutarOrden: boolean = false;

  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public funcionesUsuario: Array<string> = [];//Funciones del usuario actual

  constructor(
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private ordenPedidoService: OrdenPedidoService,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private api: ApiRequestService,
    private archivoService: ArchivoService
  ) {
    moment.locale('es');
    this.constantes = LS;
    this.es = utilService.setLocaleDate();
  }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.iniciarAtajos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.parametrosBusqueda) {
      this.reiniciarValores();
      if (this.empresaSeleccionada && this.parametrosBusqueda) {
        LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
        //Buscar ordenes de pedido, 
        this.filtroGlobal = "";
        this.buscarOrdenesPedido();
      }
    }
    if (changes.filasTiempoRecargar) {
      this.actualizarFilas();
    }
    if (changes.operacion) {
      if (this.operacion.accion) {
        this.operacionEnLista(this.operacion);
      }
    }
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarOrdenPedido') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirListado') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarListado') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (event: KeyboardEvent): boolean => {
      if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true) && this.objetoSeleccionado) {
        this.parametrosBusqueda.visualizarConsultaOrdenPedido ? this.consultarOrdenPedidoEvaluando() : this.consultarOrdenPedido();
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_DESMAYORIZAR, (event: KeyboardEvent): boolean => {
      if (!this.dataFormularioPedido && !this.dataFormularioCompra) {
        if (this.objetoSeleccionado && this.ordenPedidoService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_POR_APROBAR_PEDIDO) {
          this.desmayorizarOrdenPedido();
        }
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MAYORIZAR, (event: KeyboardEvent): boolean => {
      if (!this.dataFormularioPedido && !this.dataFormularioCompra) {
        if (this.objetoSeleccionado && this.ordenPedidoService.verificarPermiso(LS.ACCION_MAYORIZAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_PENDIENTE) {
          this.mayorizarOrdenPedido(this.objetoSeleccionado);
        }
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ANULAR, (event: KeyboardEvent): boolean => {
      if (!this.dataFormularioPedido && !this.dataFormularioCompra) {
        if (this.objetoSeleccionado && this.ordenPedidoService.verificarPermiso(LS.ACCION_ANULAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) !== LS.ETIQUETA_PENDIENTE && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) !== LS.ETIQUETA_ANULADO) {
          this.anularOrdenPedido();
        }
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_RESTAURAR, (event: KeyboardEvent): boolean => {
      if (!this.dataFormularioPedido && !this.dataFormularioCompra) {
        if (this.objetoSeleccionado && this.ordenPedidoService.verificarPermiso(LS.ACCION_RESTAURAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_ANULADO) {
          this.resturarOrdenPedido();
        }
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (!this.dataFormularioPedido && !this.dataFormularioCompra) {
        if (this.objetoSeleccionado && this.ordenPedidoService.verificarPermiso(LS.ACCION_ELIMINAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_PENDIENTE) {
          this.eliminarOrdenPedido(this.objetoSeleccionado);
        }
      }
      return false;
    }));
  }

  reiniciarValores() {
    this.filasTiempo.filas = 0;
    this.activar = false;
    this.accion = null;
    this.dataFormularioPedido = null;
    this.vistaListado = false;
    this.mostrarFormularioAprobarOrden = false;
    this.mostrarFormularioEjecutarOrden = false;
    this.iniciarAtajos();
  }

  /** Filtra las ordenes de pedido */
  buscarOrdenesPedido() {
    this.filasTiempo.filas = 0;
    this.cargando = true;
    this.limpiarResultado();
    if (this.parametrosBusqueda.fechaInicio && this.parametrosBusqueda.fechaFin) {
      this.parametrosBusqueda['fechaInicio'] = this.utilService.formatearDateToStringDDMMYYYY(this.parametrosBusqueda.fechaInicio);
      this.parametrosBusqueda['fechaFin'] = this.utilService.formatearDateToStringDDMMYYYY(this.parametrosBusqueda.fechaFin);
    }
    this.funcionesUsuario = this.parametrosBusqueda ? this.parametrosBusqueda.funcionesUsuario : null;
    this.parametrosBusqueda.visualizarConsultaOrdenPedido ? this.ordenPedidoService.listaInvPedidosOrdenTO(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT) : this.ordenPedidoService.listarOrdenesPedido(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Callback, despues de traer la lista de Ordenes de pedido */
  despuesDeListarOrdenPedido(data) {
    this.listadoResultado = data ? data : [];
    this.actualizarFilas();
    this.vistaListado = true;
    this.cargando = false;
    this.iniciarAgGrid();
  }

  /** Limpia la busqueda actualmente cargada */
  limpiarResultado() {
    this.vistaListado = false;
    this.listadoResultado = [];
    this.objetoSeleccionado = new InvPedidoTO();
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  imprimirListado() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listadoInvPedidosTOSeleccionado = this.utilService.getAGSelectedData(this.gridApi);
      if (listadoInvPedidosTOSeleccionado.length === 0) {
        this.toastr.info(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let respuestaVerificacionLista = this.utilService.enviarListadoPedidosSeleccionados(listadoInvPedidosTOSeleccionado.slice());
        if (respuestaVerificacionLista.conStatus) {
          this.cargando = false;
          this.toastr.warning(respuestaVerificacionLista.mensaje, LS.TAG_AVISO);
        } else {
          if (respuestaVerificacionLista.listadoResultado.length > 0) {
            let parametros = {
              codigoSector: this.parametrosBusqueda && this.parametrosBusqueda.busqueda ? this.parametrosBusqueda.busqueda : "",
              codigoMotivo: this.parametrosBusqueda && this.parametrosBusqueda.motivo ? this.parametrosBusqueda.motivo : "",
              listadoInvPedidosTO: listadoInvPedidosTOSeleccionado,
              nombreReporte: this.parametrosBusqueda.visualizarConsultaOrdenPedido ? LS.NOMBRE_REPORTE_GENERAR_ORDEN_PEDIDO_LISTADO : LS.NOMBRE_REPORTE_GENERAR_ORDEN_PEDIDO_LISTADO
            };
            this.archivoService.postPDF("todocompuWS/pedidosWebController/generarReporteInvPedidosTO", parametros, this.empresaSeleccionada)
              .then(data => {
                (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ordenesPedidoListado_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data)
                  : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
                this.cargando = false;
              }).catch(err => this.utilService.handleError(err, this));

          }
        }
      }
    }
  }

  imprimirIndividual() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listadoInvPedidosTOSeleccionado = this.utilService.getAGSelectedData(this.gridApi);
      let listaInvPedidosPK = this.ordenPedidoService.formatearImprimirPedidosIndividual(listadoInvPedidosTOSeleccionado);
      if (listaInvPedidosPK.length === 0) {
        this.toastr.info(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let respuestaVerificacionLista = this.utilService.enviarListadoPedidosSeleccionados(listadoInvPedidosTOSeleccionado.slice());
        if (respuestaVerificacionLista.conStatus) {
          this.cargando = false;
          this.toastr.warning(respuestaVerificacionLista.mensaje, LS.TAG_AVISO);
        } else {
          if (respuestaVerificacionLista.listadoResultado.length > 0) {
            let parametros = {
              listaInvPedidosPK: listaInvPedidosPK,
              nombreReporte: this.parametrosBusqueda.visualizarConsultaOrdenPedido ? LS.NOMBRE_REPORTE_GENERAR_ORDEN_PEDIDO_LOTE : LS.NOMBRE_REPORTE_GENERAR_ORDEN_PEDIDO_LOTE
            };
            this.archivoService.postPDF("todocompuWS/pedidosWebController/generarReporteInvPedidosLote", parametros, this.empresaSeleccionada)
              .then(data => {
                (data._body.byteLength > 0) ?
                  this.utilService.descargarArchivoPDF('ordenesPedidosIndividual_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data)
                  : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
                this.cargando = false;
              }).catch(err => this.utilService.handleError(err, this));
          }
        }
      }
    }
  }

  imprimirOrdenPedido(ordenPedido) {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let invPedidosPK = new InvPedidosPK({ pedEmpresa: ordenPedido.codigoempresa, pedNumero: ordenPedido.pedidonumero, pedMotivo: ordenPedido.codigomotivo, pedSector: ordenPedido.codigosector });
      let parametro = { invPedidosPK: invPedidosPK, nombreReporte: LS.NOMBRE_REPORTE_GENERAR_ORDEN_PEDIDO };
      this.archivoService.postPDF("todocompuWS/pedidosWebController/generarReporteInvPedidosGeneral", parametro, this.empresaSeleccionada)
        .then(respuesta => {
          if (respuesta) {
            this.utilService.descargarArchivoPDF('ordenDePedido_' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let listadoInvPedidosTOSeleccionado = this.utilService.getAGSelectedData(this.gridApi);
      if (listadoInvPedidosTOSeleccionado.length === 0) {
        this.toastr.info(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let parametros = {
          codigoMotivo: this.parametrosBusqueda && this.parametrosBusqueda.motivoSeleccionado ? this.parametrosBusqueda.motivoSeleccionado.pmCodigo : "",
          listadoInvPedidosTO: listadoInvPedidosTOSeleccionado
        };
        this.archivoService.postExcel("todocompuWS/pedidosWebController/exportarReporteInvPedidosTO", parametros, this.empresaSeleccionada)
          .then(data => {
            if (data) {
              this.utilService.descargarArchivoExcel(data._body, "ListadoOrdenesPedido_");
            } else {
              this.toastr.warning(LS.MSJ_NO_DATA);
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      }
    }
  }

  //#region OPERACIONES DE ORDEN DE PEDIDO
  consultarOrdenPedidoEvaluando() {
    let estado = this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado);
    switch (estado) {
      case LS.ETIQUETA_PENDIENTE:
      case LS.ETIQUETA_POR_APROBAR_PEDIDO:
      case LS.ETIQUETA_ANULADO:
        {
          this.consultarOrdenPedido();
          this.mostrarFormularioAprobarOrden = false;
          this.mostrarFormularioEjecutarOrden = false;
          break;
        }
      case LS.ETIQUETA_PEDIDO_APROBADO:
        {
          this.consultarOrdenPedido();
          this.mostrarFormularioAprobarOrden = true;
          this.mostrarFormularioEjecutarOrden = false;
          break;
        }
      case LS.ETIQUETA_EJECUTADO:
        {
          this.consultarOrdenPedidoEjecutado();
          this.mostrarFormularioAprobarOrden = false;
          this.mostrarFormularioEjecutarOrden = true;
          break;
        }
    }
  }

  consultarOrdenPedido() {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_CONSULTAR;
      this.mostrarObjetoParaAccion(this.objetoSeleccionado);
    }
  }

  consultarOrdenPedidoEjecutado() {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_CONSULTAR;
      this.dataFormularioPedido = {
        accion: this.accion,
        invPedidosPK: new InvPedidosPK({
          pedEmpresa: this.objetoSeleccionado.codigoempresa,
          pedMotivo: this.objetoSeleccionado.codigomotivo,
          pedNumero: this.objetoSeleccionado.pedidonumero,
          pedSector: this.objetoSeleccionado.codigosector
        }),
        invPedidoTO: this.objetoSeleccionado
      }
      this.cargando = false;
    }
  }

  consultarOrdenCompra(event) {
    if (event.accion && event.detSecuencial && this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      if (event.accion === LS.ACCION_CARRITO) {
        this.dataFormularioCompra = { accion: LS.ACCION_CARRITO, detSecuencial: event.detSecuencial, vista: 'ordencompra' };
      }
    }
  }

  mayorizarOrdenPedido(ordenPedido) {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_MAYORIZAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_MAYORIZAR;
      this.mostrarObjetoParaAccion(ordenPedido);
    }
  }

  desmayorizarOrdenPedido() {
    this.cargando = true;
    let pk = new InvPedidosPK({ pedEmpresa: this.objetoSeleccionado.codigoempresa, pedSector: this.objetoSeleccionado.codigosector, pedMotivo: this.objetoSeleccionado.codigomotivo, pedNumero: this.objetoSeleccionado.pedidonumero });
    this.api.post("todocompuWS/pedidosWebController/desmayorizarInvPedidos", { invPedidosPK: pk }, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.objetoSeleccionado.estado = LS.ETIQUETA_PENDIENTE;
          this.objetoSeleccionado.pedpendiente = true;

          this.refreshGrid();
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
          if (this.ordenPedidoService.verificarPermiso(LS.ACCION_MAYORIZAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_PENDIENTE) {
            swal(this.utilService.generarSwalConfirmationOption(LS.MSJ_TITULO_MAYORIZAR, LS.MSJ_PREGUNTA_MAYORIZAR, LS.SWAL_QUESTION))
              .then((result) => {
                if (result.value) {
                  this.mayorizarOrdenPedido(this.objetoSeleccionado);
                }
              });
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  anularOrdenPedido() {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_ANULAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_ANULAR;
      this.mostrarObjetoParaAccion(this.objetoSeleccionado);
    }
  }

  resturarOrdenPedido() {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_RESTAURAR, this, true)) {
      this.cargando = true;
      let pk = new InvPedidosPK({ pedEmpresa: this.objetoSeleccionado.codigoempresa, pedSector: this.objetoSeleccionado.codigosector, pedMotivo: this.objetoSeleccionado.codigomotivo, pedNumero: this.objetoSeleccionado.pedidonumero });
      this.api.post("todocompuWS/pedidosWebController/restaturarInvPedidos", { invPedidosPK: pk }, LS.KEY_EMPRESA_SELECT)
        .then(respuesta => {
          if (respuesta && respuesta.extraInfo) {
            this.objetoSeleccionado.estado = LS.ETIQUETA_POR_APROBAR_PEDIDO;
            this.objetoSeleccionado.pedanulado = false;
            this.refreshGrid();
            this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
          } else {
            this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  ejecutarOrdenPedido(ordenPedido) {
    if (this.utilService.verificarPermiso(LS.ACCION_EJECUTAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_EJECUTAR;
      this.mostrarObjetoParaAccion(ordenPedido);
    }
  }

  eliminarOrdenPedido(ordenPedido: InvPedidoTO) {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_ELIMINAR;
      this.mostrarObjetoParaAccion(ordenPedido);
    }
  }

  desAprobarOrdenPedido(ordenPedido) {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_DESAPROBAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_DESAPROBAR;
      this.mostrarObjetoParaAccion(ordenPedido);
    }
  }

  /** Mostrar el objeto para editar, aprobar o ejecutar */
  mostrarObjetoParaAccion(ordenPedido: InvPedidoTO) {
    this.dataFormularioPedido = {
      accion: this.accion,
      invPedidosPK: new InvPedidosPK({
        pedEmpresa: ordenPedido.codigoempresa,
        pedMotivo: ordenPedido.codigomotivo,
        pedNumero: ordenPedido.pedidonumero,
        pedSector: ordenPedido.codigosector
      }),
      tipo: 'GENERAROP',
      invPedidoTO: ordenPedido
    }
    this.cargando = false;
  }

  //#region [R3] FUNCIONES GENERALES
  cancelar(event?) {
    if (event && event.accion === LS.ACCION_CARRITO) {
      this.dataFormularioCompra = null;
    } else {
      this.enviarCancelar.emit();
      this.dataFormularioPedido = null;
      this.dataFormularioCompra = null;
      this.vistaListado = true;
      this.accion = null;
      this.mostrarFormularioAprobarOrden = false;
      this.mostrarFormularioEjecutarOrden = false;
      this.iniciarAtajos();
    }
  }

  cambiarActivar() {
    this.activar = !this.activar;
    this.enviarActivar.emit({ activar: this.activar, deshabilitarOpciones: false, gridApi: this.gridApi });
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  cambiarActivarFormulario(event) {
    this.vistaListado = event.vistaListado;
    let objetoActivar = { 'activar': event.activar, 'deshabilitarOpciones': true }
    this.enviarActivar.emit(objetoActivar);
  }

  operacionEnLista(event) {
    switch (event.accion) {
      case LS.LST_INSERTAR: {
        this.refrescarTabla(event.objeto, 'I');
        this.cancelar();
      }
      case LS.LST_ACTUALIZAR: {
        this.refrescarTabla(event.objeto, 'U');
        this.cancelar();
        break;
      }
      case LS.LST_ELIMINAR: {
        this.refrescarTabla(event.objeto, 'D');
        this.cancelar();
        break;
      }
      case LS.LST_LIMPIAR: {
        this.limpiarResultado();
        this.cancelar();
        break;
      }
      case LS.ACCION_EJECUTAR: {
        this.dataFormularioPedido = null;
        this.mostrarFormularioAprobarOrden = false;
        this.enviarDatosOC.emit(event);
        break;
      }
    }
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.ordenPedidoService.generarColumnasOrdenPedido(this);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
      iconoEstado: IconoEstadoComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      // scrolls to the first column
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      // sets focus into the first grid cell
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    this.parametrosBusqueda.visualizarConsultaOrdenPedido ? this.generarOpcionesConsultaOrdenesPedido() : this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  generarOpciones() {
    let perConsultar = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this);
    let perMayorizar = this.ordenPedidoService.verificarPermiso(LS.ACCION_MAYORIZAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_PENDIENTE;
    let perDesmayorizar = this.ordenPedidoService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_POR_APROBAR_PEDIDO;
    let perEliminar = this.ordenPedidoService.verificarPermiso(LS.ACCION_ELIMINAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_PENDIENTE;
    let perAnular = this.ordenPedidoService.verificarPermiso(LS.ACCION_ANULAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) !== LS.ETIQUETA_PENDIENTE && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) !== LS.ETIQUETA_ANULADO;
    let perRestaurar = this.ordenPedidoService.verificarPermiso(LS.ACCION_RESTAURAR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) === LS.ETIQUETA_ANULADO;
    let perImprimir = this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this) && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) !== LS.ETIQUETA_PENDIENTE && this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado) !== LS.ETIQUETA_ANULADO;

    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: (event) => perConsultar ? this.consultarOrdenPedido() : null },
      { label: LS.ACCION_MAYORIZAR, icon: LS.ICON_MAYORIZAR, disabled: !perMayorizar, command: (event) => perMayorizar ? this.mayorizarOrdenPedido(this.objetoSeleccionado) : null },
      { label: LS.ACCION_DESMAYORIZAR, icon: LS.ICON_DESMAYORIZAR, disabled: !perDesmayorizar, command: (event) => perDesmayorizar ? this.desmayorizarOrdenPedido() : null },
      { label: LS.ACCION_ANULAR, icon: LS.ICON_ANULAR, disabled: !perAnular, command: (event) => perAnular ? this.anularOrdenPedido() : null },
      { label: LS.ACCION_RESTAURAR, icon: LS.ICON_RESTAURAR, disabled: !perRestaurar, command: (event) => perRestaurar ? this.resturarOrdenPedido() : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: (event) => perEliminar ? this.eliminarOrdenPedido(this.objetoSeleccionado) : null },
      { label: LS.ACCION_IMPRIMIR, icon: LS.ICON_IMPRIMIR, disabled: !perImprimir, command: (event) => perImprimir ? this.imprimirOrdenPedido(this.objetoSeleccionado) : null }
    ];
  }

  generarOpcionesConsultaOrdenesPedido() {
    let estado = this.ordenPedidoService.getEstadoInvPedidoTO(this.objetoSeleccionado);
    let perConsultar = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this);
    let perMayorizar = this.ordenPedidoService.verificarPermiso(LS.ACCION_MAYORIZAR, this);
    let perEliminar = this.ordenPedidoService.verificarPermiso(LS.ACCION_ELIMINAR, this);
    let perDesmayorizar = this.ordenPedidoService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this);
    let perAnular = this.ordenPedidoService.verificarPermiso(LS.ACCION_ANULAR, this);
    let perRestaurar = this.ordenPedidoService.verificarPermiso(LS.ACCION_RESTAURAR, this);
    let perDesAprobar = this.ordenPedidoService.verificarPermiso(LS.ACCION_DESAPROBAR, this);
    let perImprimir = this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this);

    switch (estado) {
      case LS.ETIQUETA_PENDIENTE: {
        this.opciones = [
          { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: (event) => perConsultar ? this.consultarOrdenPedido() : null },
          { label: LS.ACCION_MAYORIZAR, icon: LS.ICON_MAYORIZAR, disabled: !perMayorizar, command: (event) => perMayorizar ? this.mayorizarOrdenPedido(this.objetoSeleccionado) : null },
          { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: (event) => perEliminar ? this.eliminarOrdenPedido(this.objetoSeleccionado) : null },
        ];
        this.mostrarFormularioAprobarOrden = false;
        this.mostrarFormularioEjecutarOrden = false;
        break;
      }
      case LS.ETIQUETA_POR_APROBAR_PEDIDO: {//No esta anulado, no esta pendiente, no esta ejecutado y no esta aprobado
        this.opciones = [
          { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: (event) => perConsultar ? this.consultarOrdenPedido() : null },
          { label: LS.ACCION_DESMAYORIZAR, icon: LS.ICON_DESMAYORIZAR, disabled: !perDesmayorizar, command: (event) => perDesmayorizar ? this.desmayorizarOrdenPedido() : null },
          { label: LS.ACCION_ANULAR, icon: LS.ICON_ANULAR, disabled: !perAnular, command: (event) => perAnular ? this.anularOrdenPedido() : null },
          { label: LS.ACCION_IMPRIMIR, icon: LS.ICON_IMPRIMIR, disabled: !perImprimir, command: (event) => perImprimir ? this.imprimirOrdenPedido(this.objetoSeleccionado) : null }
        ];
        this.mostrarFormularioAprobarOrden = false;
        this.mostrarFormularioEjecutarOrden = false;
        break;
      }
      case LS.ETIQUETA_ANULADO: {
        this.opciones = [
          { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: (event) => perConsultar ? this.consultarOrdenPedido() : null },
          { label: LS.ACCION_RESTAURAR, icon: LS.ICON_RESTAURAR, disabled: !perRestaurar, command: (event) => perRestaurar ? this.resturarOrdenPedido() : null },
          { label: LS.ACCION_IMPRIMIR, icon: LS.ICON_IMPRIMIR, disabled: !perImprimir, command: (event) => perImprimir ? this.imprimirOrdenPedido(this.objetoSeleccionado) : null }
        ];
        this.mostrarFormularioAprobarOrden = false;
        this.mostrarFormularioEjecutarOrden = false;
        break;
      }
      case LS.ETIQUETA_PEDIDO_APROBADO: {
        this.opciones = [
          { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: (event) => perConsultar ? this.consultarOrdenPedido() : null },
          { label: LS.ACCION_DESAPROBAR, icon: LS.ICON_DESAPROBAR, disabled: !perDesAprobar, command: () => perDesAprobar ? this.desAprobarOrdenPedido(this.objetoSeleccionado) : null },
          { label: LS.ACCION_ANULAR, icon: LS.ICON_ANULAR, disabled: !perAnular, command: () => perAnular ? this.anularOrdenPedido() : null },
          { label: LS.ACCION_IMPRIMIR, icon: LS.ICON_IMPRIMIR, disabled: !perImprimir, command: (event) => perImprimir ? this.imprimirOrdenPedido(this.objetoSeleccionado) : null }
        ];
        this.mostrarFormularioAprobarOrden = true;
        this.mostrarFormularioEjecutarOrden = false;
        break;
      }
      case LS.ETIQUETA_EJECUTADO: {
        this.opciones = [
          { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: (event) => perConsultar ? this.consultarOrdenPedidoEjecutado() : null },
          { label: LS.ACCION_IMPRIMIR, icon: LS.ICON_IMPRIMIR, disabled: !perImprimir, command: (event) => perImprimir ? this.imprimirOrdenPedido(this.objetoSeleccionado) : null }
        ];
        this.mostrarFormularioAprobarOrden = false;
        this.mostrarFormularioEjecutarOrden = true;
        break;
      }
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

  getDataSelected(): Array<any> {
    return this.utilService.getAGSelectedData(this.gridApi);
  }

  refrescarTabla(invPedidoTO: InvPedidoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoResultado.length > 0) {
          let listaTemporal = [... this.listadoResultado];
          invPedidoTO.pedfecha = JSON.parse(JSON.stringify(this.utilService.convertirFechaStringYYYYMMDD(invPedidoTO.pedfecha)));
          listaTemporal.unshift(invPedidoTO);
          this.listadoResultado = listaTemporal;
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        invPedidoTO.pedfecha = JSON.parse(JSON.stringify(this.utilService.convertirFechaStringYYYYMMDD(invPedidoTO.pedfecha)));
        var indexTemp = this.listadoResultado.findIndex(item => item.pedidonumero === invPedidoTO.pedidonumero);
        let listaTemporal = [... this.listadoResultado];
        listaTemporal[indexTemp] = invPedidoTO;
        this.listadoResultado = listaTemporal;
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoResultado.findIndex(item => item.pedidonumero === invPedidoTO.pedidonumero);
        let listaTemporal = [...this.listadoResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listadoResultado = listaTemporal;
        break;
      }
    }
    this.refreshGrid();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }
  //#endregion
}
