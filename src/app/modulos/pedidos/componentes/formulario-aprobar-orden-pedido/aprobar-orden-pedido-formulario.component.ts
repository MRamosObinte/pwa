import { Component, OnInit, EventEmitter, Output, Input, HostListener, SimpleChanges, ViewChild } from '@angular/core';
import { Contacto } from '../../../../entidadesTO/inventario/Contacto';
import { GridApi } from 'ag-grid';
import { InvPedidosDetalle } from '../../../../entidades/inventario/InvPedidosDetalle';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { InvPedidosMotivo } from '../../../../entidades/inventario/InvPedidosMotivo';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { InvPedidosConfiguracionTO } from '../../../../entidadesTO/inventario/InvPedidosConfiguracionTO';
import { InvPedidos } from '../../../../entidades/inventario/InvPedidos';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { PopOverInformacionComponent } from '../../../componentes/pop-over-informacion/pop-over-informacion.component';
import { InputLabelCellComponent } from '../../../componentes/input-label-cell/input-label-cell.component';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { InvPedidosMotivoPK } from '../../../../entidades/inventario/InvPedidosMotivoPK';
import { KardexListadoComponent } from '../../../inventario/componentes/kardex-listado/kardex-listado.component';
import { NgForm } from '@angular/forms';
import { InvPedidoTO } from '../../../../entidadesTO/inventario/InvPedidoTO';
import { InvPedidosPK } from '../../../../entidades/inventario/InvPedidosPK';
import { OrdenPedidoService } from '../../transacciones/generar-orden-pedido/orden-pedido.service';
import { LugarEntrega } from '../../../../entidadesTO/inventario/LugarEntrgea';

@Component({
  selector: 'app-aprobar-orden-pedido-formulario',
  templateUrl: './aprobar-orden-pedido-formulario.component.html'
})
export class AprobarOrdenPedidoFormularioComponent implements OnInit {
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
  public fechaActual: Date = new Date();
  public configuracion: InvPedidosConfiguracionTO;
  public funcionesUsuario: Array<string> = [];//Funciones del usuario actual
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public motivoSeleccionado: InvPedidosMotivo;
  //[ELEMENTOS DE LA ORDEN DE COMPRA]
  public configAutonumeric: AppAutonumeric;
  //AG-GRID
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
  public isAprobador: boolean = false;
  public isAprobadorRegistrador: boolean = false;
  public cantidadAprobadaCheck: boolean = true;
  public isCollapsed: boolean = true;
  public estilos: any = {};
  public parametro: any = {};
  //CLIENTE
  public isCollapseCliente: boolean = true;
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

  constructor(
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
    this.configAutonumeric = {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '99999999.99',
      minimumValue: '0',
    }
    this.estilos = { 'width': '100%', 'height': 'calc(100vh - 400px)', 'min-height': '135px' }
  }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.iniciarAtajos();
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
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
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

  /**Otras operaciones */
  cancelarAccion() {
    if (this.accion === LS.ACCION_CONSULTAR) {
      this.enviarCancelar.emit();
    } if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmOrdenPedido) && this.ordenPedidoService.puedoCancelarFormularioDetalle(this.detalleInicial, this.listadoResultado)) {
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
    //Formatear configuracion de pedido
    this.configuracion = respuesta.invPedidosConfiguracionTO;
    this.funcionesUsuario = this.ordenPedidoService.establecerFuncionesUsuario(this.configuracion);
    //Formatear motivo de pedido
    this.motivoSeleccionado = new InvPedidosMotivo(respuesta.invPedidosMotivo);
    //Comienza a verificar los permisos de acuerdo a la accion
    this.realizarAccion();
  }

  /**Establece nombres de registrador y aprobador, además se evalua si es el motivo selecciondo es automatico, si es automatico se evalua , caso contrario mostrara todos los campos de registrador y aprobador en la vista */
  establecerResponsables() {
    this.usrRegistradorNombre = this.data.invPedidoTO ? this.data.invPedidoTO.registrador : "S/D";
    this.usrAprobadorNombre = this.invPedidos.pedAprobado && this.data.invPedidoTO ? this.data.invPedidoTO.aprobador : "S/D";
    this.isAprobadorRegistrador = this.motivoSeleccionado && this.motivoSeleccionado.pmAprobacionAutomatica &&
      this.usrRegistradorNombre.trim() === this.usrAprobadorNombre.trim() &&
      this.invPedidos.pedObservacionesRegistra === this.invPedidos.pedObservacionesAprueba;
  }

  cambiarActivar() {
    this.activar = !this.activar;
    this.enviarActivar.emit({ 'activar': this.activar, 'deshabilitarOpciones': true, 'vistaListado': false });
  }

  cambiarEstadoCheckCabecera(value) {
    this.cantidadAprobadaCheck = value;
    if (this.cantidadAprobadaCheck) {
      this.gridApi.forEachNode((rowNode) => {
        rowNode.data.detCantidadAprobada = rowNode.data.detCantidadSolicitada;
      });
    } else {
      this.gridApi.forEachNode((rowNode) => {
        rowNode.data.detCantidadAprobada = 0;
      });
    }
    this.refreshGrid();
  }

  aprobarTodosPorDefecto() {
    this.listadoResultado.forEach(value => {
      value.detCantidadAprobada = value.detCantidadSolicitada;
      value.detObservacionesAprueba = this.motivoSeleccionado && this.motivoSeleccionado.pmAprobacionAutomatica ? value.detObservacionesRegistra : value.detObservacionesAprueba;
    })
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
    if (this.fechaActual > this.invPedidos.pedFechaHoraEntrega) {
      form.controls['pedidoFechaHora'].markAsTouched();
      form.controls['pedidoFechaHora'].updateValueAndValidity();
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    }
    if (validado) {
      this.invPedidos.invPedidosDetalleList = listadoDetalle;
    }
    this.cargando = validado;
    return validado;
  }

  validarDetalle(): boolean {
    let esValido = true;
    if (this.gridApi) {
      this.gridApi.forEachNode((node) => {
        let cantidadAprobadaValido = this.isAprobador ? this.ordenPedidoService.validarCantidadAprobar(node.data) : true;
        let cantidadSolicitadaValido = this.ordenPedidoService.validarCantidadSolicitada(node.data) && this.ordenPedidoService.validarProducto(node.data);
        !cantidadSolicitadaValido || !cantidadAprobadaValido ? esValido = false : null;
      });
    }
    return esValido;
  }

  collpase() {
    this.isCollapsed = !this.isCollapsed;
    let tamanio = '';
    if (this.motivoSeleccionado && this.motivoSeleccionado.pmExigirCliente && this.invPedidos.invCliente) {
      tamanio = this.collapseAmbos();
    } else {
      tamanio = this.isCollapsed ? '400px' : '260px';
    }
    this.cambiarTamanioTabla(tamanio);
  }

  collpaseCliente() {
    this.isCollapseCliente = !this.isCollapseCliente;
    let tamanio = this.collapseAmbos();
    this.cambiarTamanioTabla(tamanio);
  }

  collapseAmbos(): string {
    let tamanio = (this.isCollapsed && this.isCollapseCliente ? '585px' : (!this.isCollapsed && !this.isCollapseCliente ? '305px' : (this.isCollapsed && !this.isCollapseCliente ? '445px' : '440px')));
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

  preguntarImprimirOrdenPedido(texto: string) {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      let parametros = {
        title: LS.TOAST_CORRECTO,
        texto: texto + '<br>' + LS.MSJ_PREGUNTA_IMPRIMIR + "<br>",
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

  enviarObjetoAListaCerrar() {
    var invPedidoTO: InvPedidoTO = this.ordenPedidoService.crearInvPedidoTODeInvPedidos(this.invPedidos, this.configuracion, this.motivoSeleccionado);
    this.enviarLista.emit({ objeto: invPedidoTO, accion: LS.LST_ACTUALIZAR })
  }

  enviarNotificaciones(invPedidoCopia: InvPedidos) {
    let url = location.protocol + "//" + location.host + location.pathname;
    switch (this.accion) {
      case LS.ACCION_APROBAR: {
        if (this.configuracion.listAprobadores.length > 0) {
          if (invPedidoCopia.pedAprobado) {//si ya fue aprobado
            if (this.motivoSeleccionado && this.motivoSeleccionado.pmNotificarEjecutor) {
              let emailEjecutores = this.ordenPedidoService.obtenerUsuariosEmail("Ejecutor", this.configuracion);
              let urlCompleta = url + LS.MSJ_NOTIFICACION_RUTA_ENLACE_EJECUTAR;
              let msje = LS.MSJ_NOTIFICACION_EJECUTOR + invPedidoCopia.invPedidosPK.pedNumero + LS.MSJ_NOTIFICACION_ACCEDER_ENLACE_EJECUTAR + '<a href="' + urlCompleta + '">' + urlCompleta + "</a>";
              let parametro = { usuarioCorreo: emailEjecutores, notificacion: msje };
              this.sistemaService.enviarNotificacionUsuario(parametro, this, LS.KEY_EMPRESA_SELECT);
            }
            if (this.ordenPedidoService.estaAprobadoTodo(invPedidoCopia) && this.motivoSeleccionado && this.motivoSeleccionado.pmNotificarRegistrador) {
              let emailRegistradores = this.ordenPedidoService.obtenerUsuariosEmail("Registrador", this.configuracion);
              let urlCompleta = url + LS.MSJ_NOTIFICACION_RUTA_ENLACE_APROBADOR;
              let msje = LS.MSJ_NOTIFICACION_REGISTRADOR + invPedidoCopia.invPedidosPK.pedNumero + LS.MSJ_NOTIFICACION_ACCEDER_ENLACE_REGISTRADOR + '<a href="' + urlCompleta + '">' + urlCompleta + "</a>";
              let parametro = { usuarioCorreo: emailRegistradores, notificacion: msje };
              this.sistemaService.enviarNotificacionUsuario(parametro, this, LS.KEY_EMPRESA_SELECT);
            }
          }
        }
        break;
      }
    }
  }

  //Kardex
  ejecutarAccion(data, accion) {
    if (accion === 'verKardex') {
      this.buscarKardex(data);
    }
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

  //Tabla
  iniciarAgGrid() {
    this.columnDefs = this.ordenPedidoService.generarColumnasOrdenPedidoDetalleAprobar(this);
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
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
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

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
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

  //Cliente
  verificarSiExigeCliente() {
    this.invPedidos.invCliente ? this.estilos = { 'width': '100%', 'height': 'calc(100vh - 585px)', 'min-height': '135px' } : null;
    this.invPedidos.invCliente && this.invPedidos.invCliente.invClientePK.cliCodigo ? this.crearObjetoContactoYLugar() : null;
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

  //operaciones
  realizarAccion() {
    if (this.ordenPedidoService.verificarPermiso(this.accion, this, true)) {
      switch (this.accion) {
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
        case LS.ACCION_APROBAR: {
          this.frmTitulo = LS.PEDIDOS_APROBAR;
          this.obtenerInvPedidos();
          break;
        }
        case LS.ACCION_DESAPROBAR: {
          this.frmTitulo = LS.PEDIDOS_DESAPROBAR;
          this.obtenerInvPedidos();
          break;
        }
      }
    }
  }

  obtenerInvPedidos() {
    this.cargando = true;
    let parametro = { empresa: this.data.invPedidosPK.pedEmpresa, motivo: this.data.invPedidosPK.pedMotivo, numero: this.data.invPedidosPK.pedNumero, sector: this.data.invPedidosPK.pedSector };
    this.ordenPedidoService.obtenerOrdenPedido(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerOrdenPedido(data) {
    this.invPedidos = this.ordenPedidoService.establecerFormatoVistaIvPedidos(data);//Carga los datos
    this.invPedidos.pedObservacionesAprueba = this.accion === LS.ACCION_APROBAR && this.motivoSeleccionado && this.motivoSeleccionado.pmAprobacionAutomatica ? this.invPedidos.pedObservacionesRegistra : this.invPedidos.pedObservacionesAprueba;
    this.pedidoEstado = this.ordenPedidoService.getEstadoInvPedidos(this.invPedidos);
    this.listadoResultado = this.invPedidos.invPedidosDetalleList;
    this.establecerResponsables();
    this.vistaFormulario = true;
    this.cambiarActivar();
    this.cargando = false;
    this.invPedidos.invCliente ? this.estilos = { 'width': '100%', 'height': 'calc(100vh - 585px)', 'min-height': '135px' } : null;
    this.verificarSiExigeCliente();
    this.accion === LS.ACCION_APROBAR ? this.aprobarTodosPorDefecto() : null;
    this.iniciarAgGrid();
    this.extraerValoresIniciales();
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
          this.ordenPedidoService.anularOrdenPedido({ invPedidosPK: this.invPedidos.invPedidosPK, tipo: 'APROBAROP' }, this, LS.KEY_EMPRESA_SELECT);
        }
      });
    }
  }

  despuesDeAnularOrdenPedido(respuesta) {
    this.invPedidos.pedAprobado = false;
    this.invPedidos.pedAnulado = true;
    this.cargando = false;
    this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
    this.enviarObjetoAListaCerrar();
  }

  /** Actualizar orden de pedido */
  actualizarOrdenPedido(form: NgForm, isPendiente, accionsub?) {
    this.cargando = true
    this.isAprobador = this.accion === LS.ACCION_APROBAR ? true : false;
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaActual = data[1];//Fecha inicio en la posicion 
        if (this.validarAntesDeEnviar(form)) {
          let invPedidoCopia: InvPedidos = this.ordenPedidoService.formatearOrdenPedido(this.invPedidos, isPendiente, this, accionsub);
          invPedidoCopia.pedContactoNombre = (this.contactoPredeterminado && this.contactoPredeterminado.contacto) ? this.contactoPredeterminado.contacto.toUpperCase() : this.contactoPredeterminado;
          invPedidoCopia.pedLugarEntrega = (this.lugarEntrega && this.lugarEntrega.nombre) ? this.lugarEntrega.nombre.toUpperCase() : this.lugarEntrega;
          if (invPedidoCopia.pedAnulado) {// le metood formatearOrdenPedido valida si se anulara o no dependiendo su detalle
            this.cargando = false
            let parametrosSwal = {
              title: LS.MSJ_TITULO_ELIMINAR,
              texto: LS.MSJ_PREGUNTA_ANULAR_ORDEN_PEDIDO,
              type: LS.SWAL_WARNING,
              confirmButtonText: LS.MSJ_SI_ANULAR,
              cancelButtonText: LS.MSJ_NO_CANCELAR,
              confirmButtonColor: LS.COLOR_ELIMINAR
            }
            this.utilService.generarSwallConfirmacionHtml(parametrosSwal).then(respuesta => {
              if (respuesta) {//Si presiona aceptar
                let accionOrden = this.ordenPedidoService.obtenerAccionInvPedidos(this.accion);
                this.parametro = { invPedidos: invPedidoCopia, accion: accionOrden };
                this.ordenPedidoService.actualizarOrdenPedido(this.parametro, this, LS.KEY_EMPRESA_SELECT);
              }
            });
          } else {
            let accionOrden = this.ordenPedidoService.obtenerAccionInvPedidos(this.accion);
            this.parametro = { invPedidos: invPedidoCopia, accion: accionOrden };
            this.ordenPedidoService.actualizarOrdenPedido(this.parametro, this, LS.KEY_EMPRESA_SELECT);
          }
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  despuesDeActualizarOrdenPedido(respuesta) {
    this.invPedidos = this.ordenPedidoService.establecerFormatoVistaIvPedidos(respuesta.extraInfo);
    this.pedidoEstado = this.ordenPedidoService.getEstadoInvPedidos(this.invPedidos);
    this.enviarNotificaciones(this.parametro.invPedidos);
    if (this.pedidoEstado === "PEDIDO APROBADO" || this.pedidoEstado === "PENDIENTE" || (this.pedidoEstado === "EJECUTADO" && this.ordenPedidoService.puedeImprimirInvPedidos(this.invPedidos.invPedidosDetalleList))) {
      this.preguntarImprimirOrdenPedido(respuesta.operacionMensaje);
    } else {
      this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
      this.enviarObjetoAListaCerrar();
    }
  }

  /** Desaprobar orden de pedido */
  desaprobarPedido() {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_DESAPROBAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_DESAPROBAR,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_DESAPROBAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let invPedidoCopia: InvPedidos = this.ordenPedidoService.formatearOrdenPedido(this.invPedidos, false, this, null);
          this.ordenPedidoService.desaprobarOrdenPedido({ invPedidos: invPedidoCopia }, this, LS.KEY_EMPRESA_SELECT);
        }
      });
    }
  }

  despuesDeDesaprobarOrdenPedido(respuesta) {
    this.cargando = false;
    this.invPedidos = this.ordenPedidoService.establecerFormatoVistaIvPedidos(respuesta.extraInfo);
    this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
    this.enviarObjetoAListaCerrar();
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
            this.utilService.descargarArchivoPDF('ordenDePedido' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR);
          }
          if (close) {
            this.enviarObjetoAListaCerrar();
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

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

}
