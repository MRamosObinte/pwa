import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { InvPedidosDetalle } from '../../../../entidades/inventario/InvPedidosDetalle';
import { InvPedidos } from '../../../../entidades/inventario/InvPedidos';
import { InvPedidosMotivo } from '../../../../entidades/inventario/InvPedidosMotivo';
import { InvPedidoTO } from '../../../../entidadesTO/inventario/InvPedidoTO';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvPedidosConfiguracionTO } from '../../../../entidadesTO/inventario/InvPedidosConfiguracionTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { InvPedidosPK } from '../../../../entidades/inventario/InvPedidosPK';
import { ConfiguracionPedidoService } from '../../archivos/configuracion-pedido/configuracion-pedido.service';
import { InvPedidosMotivoPK } from '../../../../entidades/inventario/InvPedidosMotivoPK';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { ListadoProductosComponent } from '../../../inventario/componentes/listado-productos/listado-productos.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { ContextMenu } from 'primeng/contextmenu';
import { KardexListadoComponent } from '../../../inventario/componentes/kardex-listado/kardex-listado.component';
import { PopOverInformacionComponent } from '../../../componentes/pop-over-informacion/pop-over-informacion.component';
import { InputLabelCellComponent } from '../../../componentes/input-label-cell/input-label-cell.component';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { ClienteListadoComponent } from '../../../inventario/componentes/cliente-listado/cliente-listado.component';
import { InvCliente } from '../../../../entidades/inventario/InvCliente';
import { Contacto } from '../../../../entidadesTO/inventario/Contacto';
import { OrdenPedidoService } from '../../transacciones/generar-orden-pedido/orden-pedido.service';
import swal from 'sweetalert2';
import { LugarEntrega } from '../../../../entidadesTO/inventario/LugarEntrgea';
import { PrdSectorTO } from '../../../../entidadesTO/Produccion/PrdSectorTO';
import { PrdSectorPK } from '../../../../entidades/produccion/PrdSectorPK';

@Component({
  selector: 'app-orden-pedido-formulario',
  templateUrl: './orden-pedido-formulario.component.html'
})
export class OrdenPedidoFormularioComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Output() enviarCancelar: EventEmitter<any> = new EventEmitter();
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  @Output() enviarLista: EventEmitter<any> = new EventEmitter();
  public accion = null;//Bandera
  public constantes: any; //Referencia a las constantes
  public isScreamMd: boolean; //Bandera para indicar el tamaño de la pantalla
  public es: any = {}; //Locale Date (Obligatoria)
  public cargando: boolean = false;
  public activar: boolean = false;
  public frmTitulo: string; //Titulo de formulario
  public vistaFormulario = false;
  public invPedidos: InvPedidos = new InvPedidos(); //Objeto de Orden de pedido
  public pedidoEstado: string = "";
  //[CAMPOS DE ORDEN DE PEDIDO]
  public usrRegistradorNombre: string;
  public usrAprobadorNombre: string;
  public usrEjecutorNombre: string;
  public fechaActual: Date = new Date();
  public configuracion: InvPedidosConfiguracionTO;
  public funcionesUsuario: Array<string> = [];//Funciones del usuario actual
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public configAutonumeric: AppAutonumeric;
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  public listadoResultado: Array<InvPedidosDetalle> = [];
  public objetoSeleccionado: InvPedidosDetalle = null;
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";
  public rowClassRules;
  public isCollapsed: boolean = true;
  public estilos: any = {};
  public parametro: any = {};
  //CLIENTE
  public isCollapseCliente: boolean = true;
  public clienteCodigo: string = null;
  public contactoPredeterminado: any = null;
  public lugarEntrega: any = null;
  public arrayContacto: Array<Contacto> = [];
  public arrayContactoFiltrada: Array<Contacto> = [];
  public arrayContactoLugarEntrega: Array<LugarEntrega> = [];
  public arrayContactoLugarEntregaFiltrada: Array<LugarEntrega> = [];
  //formulario
  @ViewChild("frmOrdenPedido") frmOrdenPedido: NgForm; //debe llamarse como el formulario
  public valoresIniciales: any;
  public detalleInicial: any;
  //Sector y motivo
  public listaSectores: Array<PrdSectorTO> = [];
  public listaMotivos: Array<InvPedidosMotivo> = [];
  public sectorSeleccionado: PrdSectorTO;
  public motivoSeleccionado: InvPedidosMotivo;
  public mostrarMotivoSeleccionar: boolean = false;
  //Texto Insertar
  public texto: string = "";

  constructor(
    private api: ApiRequestService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private atajoService: HotkeysService,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private authService: AuthService,
    private configuracionPedidoService: ConfiguracionPedidoService,
    private ordenPedidoService: OrdenPedidoService,
    private sistemaService: AppSistemaService,
    private modalService: NgbModal
  ) {
    this.constantes = LS; //Hace referncia a los constantes
    this.arrayContacto = [];
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.configAutonumeric = {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '99999999.99',
      minimumValue: '0',
    }
  }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.iniciarAtajos();
    if (this.accion === LS.ACCION_CREAR) {
      this.iniciarSectorMotivoDefault();
      this.mostrarMotivoSeleccionar = true;
    }
    if (this.accion === LS.ACCION_MAYORIZAR) {
      this.obtenerFechaServidor();
    }
    this.estilos = {
      'width': '100%',
      'height': this.mostrarMotivoSeleccionar ? 'calc(100vh - 415px)' : 'calc(100vh - 335px)',
      'min-height': '135px'
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.reiniciarValores();
      this.iniciarFormulario();
    }
  }

  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    if (this.accion != LS.ACCION_CONSULTAR) {
      event.returnValue = false;
    } else {
      return true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmOrdenPedido ? this.frmOrdenPedido.value : null));
      this.detalleInicial = JSON.parse(JSON.stringify(this.listadoResultado ? this.listadoResultado : null));
    }, 50);
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarFormOrdenPedido') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarOrdenPedido') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirOrdenPedido') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarOrdenPedido') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnEliminarOrdenPedido') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ANULAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnAnularOrdenPedido') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarOrdenPedido') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  reiniciarValores() {
    this.motivoSeleccionado = new InvPedidosMotivo();
    this.configuracion = new InvPedidosConfiguracionTO();
    this.funcionesUsuario = [];
    this.activar = false;
    this.frmTitulo = "";
    this.vistaFormulario = false;
  }

  iniciarFormulario() {
    if (this.empresaSeleccionada && this.data && this.data.accion && this.data.invPedidosPK) {
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.accion = this.data.accion;
      this.iniciarAgGrid();
      this.obtenerDatosParaGenerarOP();
    }
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
    this.invPedidos.pedFechaEmision = this.obtenerFechaEmision(respuesta.fechaActual);
    //Formatear configuracion de pedido
    this.configuracion = respuesta.invPedidosConfiguracionTO;
    this.funcionesUsuario = this.ordenPedidoService.establecerFuncionesUsuario(this.configuracion);
    //Formatear motivo de pedido
    this.motivoSeleccionado = new InvPedidosMotivo(respuesta.invPedidosMotivo);
    //Comienza a verificar los permisos de acuerdo a la accion
    this.realizarAccion();
  }

  establecerResponsables() {
    this.usrRegistradorNombre = this.data.invPedidoTO ? this.data.invPedidoTO.registrador : "S/D";
    this.usrAprobadorNombre = this.invPedidos.pedAprobado && this.data.invPedidoTO ? this.data.invPedidoTO.aprobador : "S/D";
    this.usrEjecutorNombre = this.invPedidos.pedEjecutado && this.data.invPedidoTO ? this.data.invPedidoTO.ejecutor : "S/D";
  }

  validarAntesDeEnviar(form: NgForm) {
    let validado = true;
    var detalleValidado = this.validarDetalle();
    let listadoDetalle = this.getRowData();
    let formTouched = this.utilService.establecerFormularioTocado(form);
    if (!(formTouched && form && form.valid && detalleValidado)) {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    } else if (listadoDetalle.length === 0) {
      this.toastr.error(LS.MSJ_INGRESE_DATOS_DETALLE, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    }
    if (this.invPedidos.pedFechaEmision > this.invPedidos.pedFechaHoraEntrega) {
      form.controls['pedidoFechaHora'].markAsTouched();
      form.controls['pedidoFechaHora'].updateValueAndValidity();
      validado ? this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS) : null;
      validado = false;
    }
    if (validado) {
      this.invPedidos.invPedidosDetalleList = listadoDetalle;
    }
    this.cargando = validado;
    return validado;
  }

  enviarNotificaciones(invPedidoCopia: InvPedidos) {
    let url = location.protocol + "//" + location.host + location.pathname;
    switch (this.accion) {
      case LS.ACCION_CREAR: {
        if (this.configuracion.listAprobadores.length > 0) {
          if (this.funcionesUsuario.indexOf('Registrador') > -1 && !this.motivoSeleccionado.pmAprobacionAutomatica) {//Si es solo registrador 
            if (this.motivoSeleccionado.pmNotificarAprobador && !invPedidoCopia.pedPendiente) {
              let emailAprobadores = this.ordenPedidoService.obtenerUsuariosEmail("Aprobador", this.configuracion);
              let urlCompleta = url + LS.MSJ_NOTIFICACION_RUTA_ENLACE_APROBADOR;
              let msje = LS.MSJ_NOTIFICACION_APROBADOR + invPedidoCopia.invPedidosPK.pedNumero + LS.MSJ_NOTIFICACION_ACCEDER_ENLACE_APROBADOR + '<a href="' + urlCompleta + '">' + urlCompleta + "</a>";
              let parametro = { usuarioCorreo: emailAprobadores, notificacion: msje };
              this.sistemaService.enviarNotificacionUsuario(parametro, this, LS.KEY_EMPRESA_SELECT);
            }
          }
          if (this.funcionesUsuario.indexOf('Registrador') > -1 && this.funcionesUsuario.indexOf('Aprobador') > -1 && this.motivoSeleccionado.pmAprobacionAutomatica) {//Si aprobador y registrador son la misma persona
            if (invPedidoCopia.pedAprobado) {//si ya fue aprobado
              if (this.motivoSeleccionado.pmNotificarEjecutor && !invPedidoCopia.pedPendiente) {
                let emailEjecutores = this.ordenPedidoService.obtenerUsuariosEmail("Ejecutor", this.configuracion);
                let urlCompleta = url + LS.MSJ_NOTIFICACION_RUTA_ENLACE_EJECUTAR;
                let msje = LS.MSJ_NOTIFICACION_EJECUTOR + invPedidoCopia.invPedidosPK.pedNumero + LS.MSJ_NOTIFICACION_ACCEDER_ENLACE_EJECUTAR + + '<a href="' + urlCompleta + '">' + urlCompleta + "</a>";
                let parametro = { usuarioCorreo: emailEjecutores, notificacion: msje };
                this.sistemaService.enviarNotificacionUsuario(parametro, this, LS.KEY_EMPRESA_SELECT);
              }
            }
          }
        }
        break;
      }
    }
  }

  preguntarImprimirOrdenPedido(texto: string) {
    if (this.motivoSeleccionado.pmAprobacionAutomatica && this.funcionesUsuario.indexOf('Ejecutor') > -1 && !this.invPedidos.pedPendiente && !this.invPedidos.pedAnulado && this.invPedidos.pedAprobado) {
      swal({
        title: LS.TOAST_CORRECTO,
        type: 'success',
        html: texto + '<br>' + '¿Desea generar la orden de compra?',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: "<i class='" + LS.ICON_IMPRIMIR + "'></i>  " + LS.LABEL_IMPRIMIR,
        confirmButtonColor: '#416273',
      }).then((result) => {
        if (result.value) {
          this.accion = LS.ACCION_EJECUTAR;
          this.enviarObjetoAListaCerrar();
        } else {
          let respuesta: any = result.dismiss;
          if (respuesta && respuesta === "close") {
            this.enviarObjetoAListaCerrar();
          } else {
            this.imprimirInvPedidos();
          }
        }
      });
    } else {
      if (this.ordenPedidoService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
        if (this.invPedidos.pedPendiente) {
          this.utilService.generarSwal(LS.TOAST_CORRECTO, LS.SWAL_SUCCESS, texto);
          this.enviarObjetoAListaCerrar();
        } else {
          let parametros = {
            title: LS.TOAST_CORRECTO,
            texto: texto + '<br>' + LS.MSJ_PREGUNTA_IMPRIMIR,
            type: LS.SWAL_SUCCESS,
            confirmButtonText: "<i class='" + LS.ICON_IMPRIMIR + "'></i>  " + LS.LABEL_IMPRIMIR,
            cancelButtonText: LS.LABEL_SALIR
          };
          this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
            if (respuesta) {//Si presiona Imprimir
              this.imprimirInvPedidos(true);
            } else {//Cierra el formulario
              this.enviarObjetoAListaCerrar();
            }
          });
        }
      }
    }

  }

  cambiarActivar() {
    this.activar = !this.activar;
    this.enviarActivar.emit({ 'activar': this.activar, 'deshabilitarOpciones': true, 'vistaListado': false });
  }

  /** Oculta el formulario y muestra la búsqueda. */
  cancelarAccion() {
    if (this.accion === LS.ACCION_CONSULTAR) {
      this.enviarCancelar.emit();
    } else {
      if (this.sePuedeCancelar()) {
        this.enviarCancelar.emit();
      } else {
        let parametros = {
          title: LS.MSJ_TITULO_CANCELAR,
          texto: LS.MSJ_PREGUNTA_CANCELAR,
          type: LS.SWAL_QUESTION,
          confirmButtonText: LS.MSJ_SI,
          cancelButtonText: LS.MSJ_NO
        }
        this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
          if (respuesta) {//Si presiona SI
            this.enviarCancelar.emit();
          }
        });
      }
    }
  }

  sePuedeCancelar(): boolean {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmOrdenPedido) && this.ordenPedidoService.puedoCancelarFormularioDetalle(this.detalleInicial, this.listadoResultado)
  }

  enviarObjetoAListaCerrar() {
    var invPedidoTO: InvPedidoTO = this.ordenPedidoService.crearInvPedidoTODeInvPedidos(this.invPedidos, this.configuracion, this.motivoSeleccionado);
    if (this.accion === LS.ACCION_CREAR) {
      this.enviarLista.emit({ objeto: invPedidoTO, accion: LS.LST_INSERTAR });//Envia el objeto y la accion a realizar
    } else if (this.accion === LS.ACCION_ELIMINAR) {
      this.enviarLista.emit({ objeto: invPedidoTO, accion: LS.LST_ELIMINAR });//Envia el objeto y la accion a realizar}
    } else {
      if (this.accion === LS.ACCION_ANULAR) {
        this.enviarLista.emit({ objeto: invPedidoTO, accion: LS.LST_ACTUALIZAR });
      } else {
        if (this.accion === LS.ACCION_EJECUTAR) {//EJECUTAR
          this.enviarLista.emit({ objeto: invPedidoTO, accion: LS.ACCION_EJECUTAR });
        } else {
          this.enviarLista.emit({ objeto: invPedidoTO, accion: LS.LST_ACTUALIZAR });//Envia el objeto y la accion a realizar
        }
      }
    }
  }

  collpase() {
    this.isCollapsed = !this.isCollapsed;
    let tamanio = '';
    if (this.motivoSeleccionado.pmExigirCliente && this.invPedidos.invCliente) {
      tamanio = this.collapseAmbos();
    } else {
      tamanio = this.isCollapsed ? (this.mostrarMotivoSeleccionar ? '415px' : '335px') : '265px';
    }
    this.cambiarTamanioTabla(tamanio);
  }

  collpaseCliente() {
    this.isCollapseCliente = !this.isCollapseCliente;
    let tamanio = this.collapseAmbos();
    this.cambiarTamanioTabla(tamanio);
  }

  collapseAmbos(): string {
    let tamanio = (this.isCollapsed && this.isCollapseCliente ? '520px' : (!this.isCollapsed && !this.isCollapseCliente ? '310px' : (this.isCollapsed && !this.isCollapseCliente ? '380px' : '445px')));
    return tamanio;
  }

  cambiarTamanioTabla(tamanio) {
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - ' + tamanio + ')',
      'min-height': '135px'
    }
  }

  soloNumeros(event) {
    return this.utilService.soloNumeros(event);
  }

  obtenerFechaServidor() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.invPedidos.pedFechaHoraEntrega = data[1];//Fecha inicio en la posicion 0
        this.extraerValoresIniciales();
      }).catch(err => this.utilService.handleError(err, this));
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.ordenPedidoService.generarColumnasOrdenPedidoDetalle(this, this.accion);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      popOverInformacion: PopOverInformacionComponent,
      inputLabelCell: InputLabelCellComponent,
      botonAccion: BotonAccionComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.gridApi.sizeColumnsToFit();
    if (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_MAYORIZAR) {
      (this.motivoSeleccionado.pmExigirCliente) ? this.focusOrdenDeCompra() : this.focusedProducto(0);
    }
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

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    let columna = filasFocusedCell ? filasFocusedCell.column : null;
    this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  alCambiarValorDeCelda(event) {
    if (event.colDef.field === "proCodigoPrincipal") {
      this.validarProducto(event.data);
    }
  }

  getRowData(): Array<InvPedidosDetalle> {
    var rowData = [];
    if (this.gridApi) {
      this.gridApi.forEachNode(function (node) {
        rowData.push(node.data);
      });
    }
    return rowData;
  }

  validarDetalle(): boolean {
    let esValido = true;
    if (this.gridApi) {
      this.gridApi.forEachNode((node) => {
        node.data.categoriaProductoValido = this.ordenPedidoService.validarCategoriaProducto(node.data, this.motivoSeleccionado);
        this.refreshGrid();
        let cantidadSolicitadaValido = this.ordenPedidoService.validarCantidadSolicitada(node.data) && this.ordenPedidoService.validarProducto(node.data) && node.data.categoriaProductoValido;
        !cantidadSolicitadaValido ? esValido = false : null;
      });
    }
    return esValido;
  }

  verificarAntesDeEliminarFila() {
    let index = this.listadoResultado.indexOf(this.objetoSeleccionado);
    if (this.listadoResultado.length > 1 && index >= 0) {
      if (this.objetoSeleccionado && this.objetoSeleccionado.detSecuencial > 0) {
        let parametros = {
          title: LS.MSJ_TITULO_ELIMINAR,
          texto: LS.MSJ_PREGUNTA_ELIMINAR,
          type: LS.SWAL_QUESTION,
          confirmButtonText: LS.MSJ_SI_ACEPTAR,
          cancelButtonText: LS.MSJ_CANCELAR,
          confirmButtonColor: LS.COLOR_ELIMINAR
        }
        this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
          if (respuesta) {//Si presiona aceptar
            this.cargando = true;
            let parametro = { detSecuencial: this.objetoSeleccionado.detSecuencial };
            this.api.post("todocompuWS/pedidosWebController/eliminarInvPedidosDetalle", parametro, LS.KEY_EMPRESA_SELECT)
              .then(respuesta => {
                if (respuesta && respuesta.extraInfo) {
                  this.toastr.success(respuesta.operacionMensaje, 'Correcto');
                  this.eliminarFila(index);
                } else {
                  this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
                }
                this.cargando = false;
              }).catch(err => this.utilService.handleError(err, this));
          }
        });
      } else {
        this.eliminarFila(index);
      }
    }
  }

  //PRODUCTOS
  buscarProducto(params) {
    let keyCode = params.event.keyCode;
    let codigoProductoInput = params.event.target.value;
    let codigoProducto = params.data.invProducto.invProductoPK.proCodigoPrincipal;
    if (this.utilService.validarKeyBuscar(keyCode)) {
      params.data.proCodigoPrincipal = codigoProductoInput;
      let fueBuscado = (codigoProductoInput && codigoProducto && codigoProductoInput === codigoProducto);
      if (!fueBuscado) {
        codigoProductoInput = codigoProductoInput === '' ? null : codigoProductoInput;
        codigoProductoInput = codigoProductoInput ? codigoProductoInput.toUpperCase() : null;
        if (codigoProductoInput) {
          let parametroBusquedaProducto = { empresa: this.empresaSeleccionada.empCodigo, busqueda: codigoProductoInput, categoria: this.motivoSeleccionado.invProductoCategoria.invProductoCategoriaPK.catCodigo, incluirInactivos: false, limite: false };
          this.abrirModalProducto(parametroBusquedaProducto, params);
        } else {
          if (keyCode === LS.KEYCODE_TAB) {
            this.gridApi.tabToNextCell();
          } else {
            this.productoFocusCell(params.node.rowIndex);
          }
        }
      } else {
        if (keyCode === LS.KEYCODE_TAB) {
          this.gridApi.tabToNextCell();
        } else {
          this.productoFocusCell(params.node.rowIndex);
        }
      }
    }
  }

  abrirModalProducto(parametroBusquedaProducto, params) {
    let index = params.node.rowIndex;
    const modalRef = this.modalService.open(ListadoProductosComponent, { size: 'lg', backdrop: 'static', windowClass: 'miSize' });
    modalRef.componentInstance.parametrosBusqueda = parametroBusquedaProducto;
    modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      if (result) {
        let resultado = new InvListaProductosGeneralTO(result);
        params.event.target.value = resultado.proCodigoPrincipal;
        params.data.proCodigoPrincipal = resultado.proCodigoPrincipal;
        params.data.invProducto.invProductoPK.proCodigoPrincipal = resultado.proCodigoPrincipal;
        params.data.invProducto.invProductoPK.proEmpresa = this.empresaSeleccionada.empCodigo;
        params.data.invProducto.proNombre = resultado.proNombre;
        params.data.invProducto.invProductoMedida.medDetalle = resultado.detalleMedida;
        params.data.invProducto.invProductoCategoria.catDetalle = resultado.proCategoria;
        params.data.categoriaProductoValido = true;
        this.refreshGrid();
        if (index >= 0 && index === (this.listadoResultado.length - 1)) {
          this.agregarFila('down', false);
        }
        this.cantidadFocusCell(index);
      } else {
        this.productoFocusCell(index);
      }
    }, () => {
      params.data.proCodigoPrincipal = '';
      this.validarProducto(params.data);
      this.gridApi.setFocusedCell(index, 'proNombre');
      this.productoFocusCell(index);
    });
  }

  validarProducto(detalle: InvPedidosDetalle) {
    if (detalle.invProducto.invProductoPK.proCodigoPrincipal !== detalle.proCodigoPrincipal) {
      this.resetearProducto(detalle);
    }
  }

  resetearProducto(detalle) {
    detalle.proCodigoPrincipal = null;//Se borra la copia
    detalle.invProducto.invProductoPK.proCodigoPrincipal = null;
    detalle.invProducto.invProductoPK.proEmpresa = null;
    detalle.invProducto.proNombre = null;
    detalle.invProducto.invProductoMedida.medDetalle = null;
    this.refreshGrid();
  }

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

  ejecutarAccion(data, accion) {
    if (accion === 'verKardex') {
      this.buscarKardex(data);
    }
  }

  /**Metodos generales */
  //CLIENTE
  buscarCliente(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && this.invPedidos.invCliente.invClientePK.cliCodigo) {
      let fueBuscado = (this.invPedidos.invCliente.invClientePK.cliCodigo && this.clienteCodigo && this.invPedidos.invCliente.invClientePK.cliCodigo === this.clienteCodigo);
      if (!fueBuscado) {
        let parametro = { empresa: LS.KEY_EMPRESA_SELECT, busqueda: this.invPedidos.invCliente.invClientePK.cliCodigo, mostrarInactivo: false }
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
        this.invPedidos.invCliente.invClientePK.cliEmpresa = this.empresaSeleccionada.empCodigo;
        this.invPedidos.invCliente.invClientePK.cliCodigo = result ? result.cliCodigo : null;
        this.invPedidos.invCliente.cliRazonSocial = result ? result.cliRazonSocial : null;
        this.invPedidos.invCliente.invClienteGrupoEmpresarial.geNombre = result ? result.cliGrupoEmpresarialNombre : null;
        this.seleccionandoCliente(result);
        this.focusContactoNombre();
      } else {
        this.focusClienteCodigo();
      }
    }, () => {
      this.focusClienteCodigo();
    });
  }

  seleccionandoCliente(result) {
    //Por lo menos tiene 1 contacto
    if (result && result.cliLugaresEntrega) {
      this.arrayContacto = JSON.parse(result.cliLugaresEntrega);
      for (let i = 0; i < this.arrayContacto.length; i++) {
        this.contactoPredeterminado = this.arrayContacto[i].predeterminado ? this.arrayContacto[i] : null;
        if (this.arrayContacto[i].predeterminado) {
          break;
        }
      }
    }
    this.seleccionarContacto();
  }

  seleccionarContacto() {
    this.arrayContactoLugarEntrega = [];
    this.contactoPredeterminado && this.contactoPredeterminado.lugarEntrega ? this.arrayContactoLugarEntrega.push(new LugarEntrega({ nombre: this.contactoPredeterminado.lugarEntrega })) : null;
    this.contactoPredeterminado && this.contactoPredeterminado.lugarEntrega2 ? this.arrayContactoLugarEntrega.push(new LugarEntrega({ nombre: this.contactoPredeterminado.lugarEntrega2 })) : null;
    this.lugarEntrega = this.arrayContactoLugarEntrega.length > 0 ? this.arrayContactoLugarEntrega[0] : null;
    this.invPedidos.pedLugarEntrega = this.lugarEntrega;
    this.invPedidos.pedContactoNombre = this.contactoPredeterminado ? this.contactoPredeterminado.contacto : null;
    this.invPedidos.pedContactoTelefono = this.contactoPredeterminado ? this.contactoPredeterminado.telefono : null;
    this.invPedidos.pedObservacionesRegistra = this.contactoPredeterminado ? this.contactoPredeterminado.recordatorio : null;
  }

  seleccionarLugarEntrega() {
    this.invPedidos.pedLugarEntrega = this.lugarEntrega;
  }

  filtrarContactos(event) {
    let query = event.query;
    let filtered: any[] = [];
    this.arrayContacto.forEach(element => {
      if (element.contacto.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(element);
      }
    });
    this.arrayContactoFiltrada = filtered;
  }

  filtrarLugarEntrega(event) {
    let query = event.query;
    let filtered: any[] = [];
    this.arrayContactoLugarEntrega.forEach(element => {
      if (element.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(element);
      }
    });
    this.arrayContactoLugarEntregaFiltrada = filtered;
  }

  validarCliente() {
    if (this.invPedidos.invCliente.invClientePK.cliCodigo !== this.clienteCodigo) {
      this.clienteCodigo = null;
      this.invPedidos.invCliente = new InvCliente();
      this.invPedidos.pedContactoNombre = null;
      this.invPedidos.pedLugarEntrega = null;
      this.invPedidos.pedContactoTelefono = null;
      this.arrayContacto = [];
      this.contactoPredeterminado = null;
    }
  }

  verificarSiExigeCliente() {
    this.motivoSeleccionado.pmExigirCliente && !this.invPedidos.invCliente && this.accion == LS.ACCION_MAYORIZAR ? this.invPedidos.invCliente = new InvCliente() : null;
    this.motivoSeleccionado.pmExigirCliente && this.invPedidos.invCliente ? this.estilos = { 'width': '100%', 'height': 'calc(100vh - 520px)', 'min-height': '135px' } : null;
    this.motivoSeleccionado.pmExigirCliente && this.invPedidos.invCliente ? this.clienteCodigo = this.invPedidos.invCliente.invClientePK.cliCodigo : null;
    this.invPedidos.invCliente && this.accion === LS.ACCION_MAYORIZAR ? this.crearObjetoContactoYLugar() : null;//muestra combos autocompletados de contacto y lugar de entrega
  }

  crearObjetoContactoYLugar() {
    this.contactoPredeterminado = null;
    this.lugarEntrega = null;
    this.arrayContactoLugarEntrega = [];
    if (this.invPedidos.pedContactoNombre && this.invPedidos.pedContactoTelefono && this.invPedidos.pedLugarEntrega) {
      this.arrayContacto = this.invPedidos.invCliente.cliLugaresEntrega ? JSON.parse(this.invPedidos.invCliente.cliLugaresEntrega) : [];//convertir json de contacto en array de contactos
      for (let i = 0; i < this.arrayContacto.length; i++) {
        let element = this.arrayContacto[i];
        if (this.invPedidos.pedContactoNombre && element.contacto.trim() === this.invPedidos.pedContactoNombre.trim()) {
          this.contactoPredeterminado = element;
          this.arrayContactoLugarEntrega.push(new LugarEntrega({ nombre: this.invPedidos.pedLugarEntrega.trim() }));
          element.lugarEntrega ? this.arrayContactoLugarEntrega.push(new LugarEntrega({ nombre: element.lugarEntrega })) : null;
          element.lugarEntrega2 ? this.arrayContactoLugarEntrega.push(new LugarEntrega({ nombre: element.lugarEntrega2 })) : null;
          this.lugarEntrega = this.arrayContactoLugarEntrega.length > 0 ? this.arrayContactoLugarEntrega[0] : null;
          break;
        }
      }
      if (!this.contactoPredeterminado) {
        this.contactoPredeterminado = new Contacto();
        this.contactoPredeterminado.contacto = this.invPedidos.pedContactoNombre.trim();
        this.contactoPredeterminado.telefono = this.invPedidos.pedContactoTelefono.trim();
        this.contactoPredeterminado.lugarEntrega = this.invPedidos.pedLugarEntrega.trim();
        this.lugarEntrega = new LugarEntrega({ nombre: this.invPedidos.pedLugarEntrega.trim() });
      }
    }
  }

  //FOCUS
  focusedProducto(index) {
    setTimeout(() => { this.productoFocusCell(index) }, 50);
  }

  productoFocusCell(index) {
    this.gridApi.setFocusedCell(index, 'proCodigoPrincipal');
  }

  cantidadFocusCell(index) {
    this.gridApi.setFocusedCell(index, "detCantidadSolicitada");
  }

  focusClienteCodigo() {
    let element = document.getElementById('codCliente');
    element ? element.focus() : null;
  }

  focusOrdenDeCompra() {
    let element = document.getElementById('pedOrdenCompra');
    element ? element.focus() : null;
  }

  focusContactoNombre() {
    let element = document.getElementById('pedContactoNombre');
    element ? element.focus() : null;
  }

  //OPERACIONES
  realizarAccion() {
    if (this.ordenPedidoService.verificarPermiso(this.accion, this, true)) {
      switch (this.accion) {
        case LS.ACCION_CREAR: {
          this.crearInvPedidos();
          break;
        }
        case LS.ACCION_CONSULTAR: {
          this.frmTitulo = LS.PEDIDOS_CONSULTAR;
          this.obtenerInvPedidos();
          break;
        }
        case LS.ACCION_ANULAR: {
          this.frmTitulo = LS.PEDIDOS_ANULAR;
          this.obtenerInvPedidos();
          break;
        }
        case LS.ACCION_MAYORIZAR: {
          this.frmTitulo = LS.PEDIDOS_EDITAR;
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
  }

  /**Metodos para generar orden de pedido */
  crearInvPedidos() {
    this.cargando = true;
    if (!this.configuracionPedidoService.esConfiguracionPedidoValida(this.configuracion)) {
      this.utilService.generarSwal(LS.TAG_AVISO, LS.SWAL_INFO, LS.MSJ_ESTABLECER_CONFIGURACION_PEDIDO);
      this.cargando = false;
      this.cerrarFormulario();
    } else {
      let esValidoPeriodoInvMotivo = this.configuracionPedidoService.esValidoPeriodoInvMotivo(this.fechaActual, this.motivoSeleccionado, true);
      if (!esValidoPeriodoInvMotivo) {
        this.cargando = false;
        this.cerrarFormulario();
      }
      if (this.ordenPedidoService.verificarPermiso(this.accion, this, true) && esValidoPeriodoInvMotivo) {
        this.frmTitulo = LS.PEDIDOS_NUEVO;
        this.invPedidos = new InvPedidos();
        this.invPedidos.pedCodigoTransaccional = this.utilService.generarCodigoAleatorio(LS.KEY_EMPRESA_SELECT, new Date());
        this.invPedidos.pedFechaEmision = this.obtenerFechaEmision(this.fechaActual);
        this.invPedidos.usrRegistra = this.authService.getCodigoUser();
        this.usrRegistradorNombre = this.authService.getNombrecompleto();
        this.invPedidos.invPedidosDetalleList = [new InvPedidosDetalle({ detOrden: 0, detCantidadSolicitada: 1.00 })];
        this.listadoResultado = this.invPedidos.invPedidosDetalleList;
        this.pedidoEstado = "";
        this.cambiarActivar();
        this.vistaFormulario = true;
        this.cargando = false;
        this.motivoSeleccionado.pmExigirCliente ? this.estilos = { 'width': '100%', 'height': 'calc(100vh - 520px)', 'min-height': '135px' } : null;
        this.obtenerFechaServidor();
        this.extraerValoresIniciales();
      }
      this.cargando = false;
    }
  }

  obtenerFechaEmision(fechaActual): any {
    if (fechaActual) {
      let fechaActual = moment(this.fechaActual).format('YYYY-MM-DD');
      return new Date(fechaActual + ":00:00:00");
    }
    return new Date();
  }

  /** Insertar orden de pedido */
  guardarOrdenPedido(form: NgForm, isPendiente, accionsub?) {
    this.cargando = true;
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaActual = data[1];//Fecha inicio en la posicion 
        if (this.validarAntesDeEnviar(form)) {
          let invPedidoCopia: InvPedidos = this.ordenPedidoService.formatearOrdenPedido(this.invPedidos, isPendiente, this, accionsub);
          invPedidoCopia.pedContactoNombre = (this.contactoPredeterminado && this.contactoPredeterminado.contacto) ? this.contactoPredeterminado.contacto.toUpperCase() : this.contactoPredeterminado;
          invPedidoCopia.pedLugarEntrega = (this.lugarEntrega && this.lugarEntrega.nombre) ? this.lugarEntrega.nombre.toUpperCase() : this.lugarEntrega;
          this.parametro = {
            invPedidos: { ...invPedidoCopia }
          };
          this.ordenPedidoService.insertarOrdenPedido(this.parametro, this, LS.KEY_EMPRESA_SELECT);
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  despuesDeInsertarOrdenPedido(respuesta) {
    this.cargando = false;
    this.invPedidos = this.ordenPedidoService.establecerFormatoVistaIvPedidos(respuesta.extraInfo);
    this.pedidoEstado = this.ordenPedidoService.getEstadoInvPedidos(this.invPedidos);
    this.enviarNotificaciones(this.invPedidos);
    this.preguntarImprimirOrdenPedido(respuesta.operacionMensaje);
    this.texto = respuesta.operacionMensaje;
  }

  /** Actualizar orden de pedido */
  actualizarOrdenPedido(form: NgForm, isPendiente, accionsub?) {
    this.cargando = true
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaActual = data[1];//Fecha inicio en la posicion 
        if (this.validarAntesDeEnviar(form)) {
          let invPedidoCopia: InvPedidos = this.ordenPedidoService.formatearOrdenPedido(this.invPedidos, isPendiente, this, accionsub);
          invPedidoCopia.invCliente = this.motivoSeleccionado.pmExigirCliente ? invPedidoCopia.invCliente : null;
          invPedidoCopia.pedLugarEntrega = this.motivoSeleccionado.pmExigirCliente ? (this.lugarEntrega && this.lugarEntrega.nombre) ? this.lugarEntrega.nombre.toUpperCase() : this.lugarEntrega : null;
          invPedidoCopia.pedContactoNombre = this.motivoSeleccionado.pmExigirCliente ? (this.contactoPredeterminado && this.contactoPredeterminado.contacto) ? this.contactoPredeterminado.contacto.toUpperCase() : this.contactoPredeterminado : null;
          invPedidoCopia.pedContactoTelefono = this.motivoSeleccionado.pmExigirCliente ? invPedidoCopia.pedContactoTelefono : null;
          invPedidoCopia.pedLugarEntrega = this.motivoSeleccionado.pmExigirCliente ? invPedidoCopia.pedLugarEntrega : null;
          let accionOrden = this.ordenPedidoService.obtenerAccionInvPedidos(this.accion);
          this.parametro = {
            invPedidos: { ...invPedidoCopia },
            accion: accionOrden
          };
          this.ordenPedidoService.actualizarOrdenPedido(this.parametro, this, LS.KEY_EMPRESA_SELECT);
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  despuesDeActualizarOrdenPedido(respuesta) {
    this.invPedidos = this.ordenPedidoService.establecerFormatoVistaIvPedidos(respuesta.extraInfo);
    this.pedidoEstado = this.ordenPedidoService.getEstadoInvPedidos(this.invPedidos);
    this.enviarNotificaciones(this.parametro.invPedidos);
    if (this.pedidoEstado !== "PENDIENTE") {
      this.preguntarImprimirOrdenPedido(respuesta.operacionMensaje);
    } else {
      this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
      this.enviarObjetoAListaCerrar();
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
          this.ordenPedidoService.eliminarOrdenPedido(parametro, this, LS.KEY_EMPRESA_SELECT);
        }
      });
    }
  }

  despuesDeEliminarOrdenPedido(respuesta) {
    this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
    this.enviarObjetoAListaCerrar();
  }

  /** Anular orden de pedido */
  anularOrdenPedido() {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_ANULAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ANULAR_ORDEN_PEDIDO,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ANULAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          this.ordenPedidoService.anularOrdenPedido({ invPedidosPK: this.invPedidos.invPedidosPK, tipo: 'GENERAROP' }, this, LS.KEY_EMPRESA_SELECT);
        }
      });
    }
  }

  despuesDeAnularOrdenPedido(respuesta) {
    this.invPedidos.pedAnulado = true;
    this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
    this.enviarObjetoAListaCerrar();
    this.cargando = false;
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
      let parametro = { invPedidosPK: new InvPedidosPK(this.invPedidos.invPedidosPK), nombreReporte: LS.NOMBRE_REPORTE_GENERAR_ORDEN_PEDIDO };
      this.archivoService.postPDF("todocompuWS/pedidosWebController/generarReporteInvPedidosGeneral", parametro, this.empresaSeleccionada)
        .then(respuesta => {
          if (respuesta._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('ordenDePedido ' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR);
          }
          if (close) {
            this.enviarObjetoAListaCerrar();
          } else {
            this.preguntarImprimirOrdenPedido(this.texto);
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
        }).catch(err => this.utilService.handleError(err, this));
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
    this.cambiarActivar();
    this.cargando = false;
    this.verificarSiExigeCliente();
    this.extraerValoresIniciales();
  }

  //MENU
  generarOpciones() {
    let permiso = this.empresaSeleccionada.listaSisPermisoTO.gruCrear && (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_MAYORIZAR);
    this.opciones = [
      { label: LS.ACCION_AGREGAR_FILA_ARRIBA, icon: LS.ICON_FLECHA_ARRIBA, disabled: !permiso, command: () => permiso ? this.agregarFila('up', true) : null },
      { label: LS.ACCION_AGREGAR_FILA_ABAJO, icon: LS.ICON_FLECHA_ABAJO, disabled: !permiso, command: () => permiso ? this.agregarFila('down', true) : null },
      { label: LS.ACCION_ELIMINAR_FILA, icon: LS.ICON_ELIMINAR, disabled: !permiso, command: () => permiso ? this.verificarAntesDeEliminarFila() : null },
    ];
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  agregarFila(ubicacion: string, focused) {
    let index = this.listadoResultado.indexOf(this.objetoSeleccionado);
    if (index >= 0) {
      index = ubicacion === 'up' ? index : index + 1;
      var nuevoItem = this.ordenPedidoService.crearInvPedidoDetalle();
      let listaTemporal = this.listadoResultado.slice();
      listaTemporal.splice(index, 0, nuevoItem);
      this.listadoResultado = listaTemporal;
      focused ? this.focusedProducto(index) : null;
    }
    this.refreshGrid();
  }

  agregarFilaAlFinal(params) {
    let keyCode = params.event.keyCode;
    let index = this.listadoResultado.indexOf(this.objetoSeleccionado);
    if (this.utilService.validarKeyBuscar(keyCode) && (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_MAYORIZAR) && index >= 0 && index === (this.listadoResultado.length - 1)) {
      var nuevoItem = this.ordenPedidoService.crearInvPedidoDetalle();
      let listaTemporal = this.listadoResultado.slice();
      listaTemporal.push(nuevoItem);
      this.listadoResultado = listaTemporal;
      this.focusedProducto(index + 1);
    }
  }

  eliminarFila(index) {
    let listaTemporal = this.listadoResultado.slice();
    listaTemporal.splice(index, 1);
    this.listadoResultado = listaTemporal;
    this.refreshGrid();
  }

  refrescarOrdenDetallePedido() {
    let index = 0;
    this.gridApi.forEachNode((rowNode) => {
      var data = rowNode.data;
      data.detOrden = index;
      index = index + 1;
    });
  }

  //Sector y motivo, SOLO ES CUANDO LA ACCION === CREAR
  iniciarSectorMotivoDefault() {
    if (this.data) {
      //   this.motivoSeleccionado = new   this.data.motivoSeleccionado;
      // this.sectorSeleccionado = this.data.sectorSeleccionado;
      this.listaMotivos = this.data.listaMotivos;
      // this.listaSectores = this.data.listaSectores;
    }
  }

  listarMotivos() {
    this.cargando = true;
    this.listaMotivos = [];
    let empresa = this.empresaSeleccionada.empCodigo;
    let sectorpk = this.sectorSeleccionado ? new PrdSectorPK({ secEmpresa: empresa, secCodigo: this.sectorSeleccionado.secCodigo }) : null;
    let parametro = { empresa: empresa, incluirInactivos: false, prdSectorPK: sectorpk, invProductoCategoriaPK: null };
    this.configuracionPedidoService.listarInvPedidosMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarMotivos(data) {
    this.listaMotivos = [...data];
    if (this.listaMotivos.length > 0) {
      this.motivoSeleccionado = this.listaMotivos && this.motivoSeleccionado.invPedidosMotivoPK.pmCodigo ? this.listaMotivos.find(item => item.invPedidosMotivoPK.pmCodigo === this.motivoSeleccionado.invPedidosMotivoPK.pmCodigo) : this.listaMotivos[0];
    } else {
      this.motivoSeleccionado = null;
    }
    this.cargando = false;
    this.traerConfiguracionPedidos();
  }

  traerConfiguracionPedidos() {
    this.funcionesUsuario = [];
    this.configuracion = new InvPedidosConfiguracionTO();
    if (this.motivoSeleccionado && this.motivoSeleccionado.invPedidosMotivoPK.pmCodigo) {
      this.cargando = true;
      let parametro = { empresa: LS.KEY_EMPRESA_SELECT, invPedidosMotivoPK: this.motivoSeleccionado.invPedidosMotivoPK };
      this.configuracionPedidoService.getListaInvPedidosConfiguracion(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeListarConfiguracionPedido(respuesta) {
    if (this.motivoSeleccionado.pmExigirCliente) {
      this.estilos = { 'width': '100%', 'height': 'calc(100vh - 520px)', 'min-height': '135px' }
    } else {
      this.invPedidos.invCliente = new InvCliente();
      this.invPedidos.pedContactoTelefono = null;
      this.invPedidos.pedLugarEntrega = null;
      this.invPedidos.pedContactoNombre = null;
      this.arrayContacto = [];
      this.arrayContactoLugarEntrega = [];
      this.lugarEntrega = null;
      this.contactoPredeterminado = null;
      this.estilos = { 'width': '100%', 'height': this.mostrarMotivoSeleccionar ? 'calc(100vh - 415px)' : 'calc(100vh - 335px)', 'min-height': '135px' }
    }
    this.configuracion = respuesta;
    this.funcionesUsuario = this.ordenPedidoService.establecerFuncionesUsuario(this.configuracion);
    if (this.funcionesUsuario.indexOf('Registrador') <= -1) {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO);
    }
    this.cargando = false;
  }

  inicializarMotivos(m1: InvPedidosMotivo, m2: InvPedidosMotivo) {
    if (m1 && m2) {
      return m1.invPedidosMotivoPK.pmCodigo === m2.invPedidosMotivoPK.pmCodigo;
    }
  }

}
