import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { CajCajaTO } from '../../../../entidadesTO/caja/CajCajaTO';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { InvVentaMotivoComboTO } from '../../../../entidadesTO/inventario/InvVentaMotivoComboTO';
import { InvVentasTO } from '../../../../entidadesTO/inventario/InvVentasTO';
import { InvVentasDetalleTO } from '../../../../entidadesTO/inventario/InvVentasDetalleTO';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteListadoComponent } from '../cliente-listado/cliente-listado.component';
import { InvFunListadoClientesTO } from '../../../../entidadesTO/inventario/InvFunListadoClientesTO';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { InvClienteTO } from '../../../../entidadesTO/inventario/InvClienteTO';
import { ListadoProductosComponent } from '../listado-productos/listado-productos.component';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { PiscinaService } from '../../../produccion/archivos/piscina/piscina.service';
import { InvProductoEtiquetas } from '../../../../entidades/inventario/InvProductoEtiquetas';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { InvVentasFormaCobroTO } from '../../../../entidadesTO/inventario/InvVentasFormaCobroTO';
import { NgForm } from '@angular/forms';
import { InvProductoDAOTO } from '../../../../entidadesTO/inventario/InvProductoDAOTO';
import { ModalVentaDetalleComponent } from './modal-venta-detalle/modal-venta-detalle.component';
import { AnxTipoComprobanteComboTO } from '../../../../entidadesTO/anexos/AnxTipoComprobanteComboTO';
import { ClaveValor } from '../../../../enums/ClaveValor';
import { MotivoComplemento } from '../../../../enums/MotivoComplemento';
import { ContextMenu } from 'primeng/contextmenu';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { MenuItem } from 'primeng/api';
import { InputLabelCellComponent } from '../../../componentes/input-label-cell/input-label-cell.component';
import { PopOverInformacionComponent } from '../../../componentes/pop-over-informacion/pop-over-informacion.component';
import { InputNumericConBotonComponent } from '../../../componentes/input-numeric-con-boton/input-numeric-con-boton.component';
import { LabelNumericConBotonComponent } from '../../../componentes/label-numeric-con-boton/label-numeric-con-boton.component';
import { VentaFormularioService } from './venta-formulario.service';
import { InvListaConsultaVentaTO } from '../../../../entidadesTO/inventario/InvListaConsultaVentaTO';
import { AnxVentaTO } from '../../../../entidadesTO/anexos/AnxVentaTO';
import { InvVentasMotivoAnulacion } from '../../../../entidades/inventario/InvVentasMotivoAnulacion';
import { VentaService } from '../../transacciones/venta/venta.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Component({
  selector: 'app-venta-formulario',
  templateUrl: './venta-formulario.component.html'
})
export class VentaFormularioComponent implements OnInit {

  constantes: any = LS;
  accion: string = null;
  tipoEmpresa: string = "";//si es comercial o no
  etiquetaSeleccionada: string = "";//define que precio aplicar
  tipoDocumentoComplemento: string = "";//tabla anexo.anx_tipocomprobante
  numeroDocumentoComplemento: string = "";//para notas de credito y debito
  motivoComplemento: string = "";//porque se va a hacer nota de credito o debito
  titulo: string = "";//segun el documento
  /**
   * parametros debe incluir: --> accion: (nuevo, editar, consulta)
   *                          --> objetoSeleccionado: (El seleccionado de la lista)
   * @memberof ClienteFormularioComponent
   */
  @Input() parametros;
  @Output() enviarAccion = new EventEmitter();
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() tipoDocumento: string;

  listaInvVentasDetalleTO: Array<InvVentasDetalleTO> = new Array();
  listaInvVentasEliminarDetalleTO: Array<InvVentasDetalleTO> = new Array();
  listadoPiscinaTO: Array<PrdListaPiscinaTO> = new Array();
  listadoFormaCobro: Array<InvVentasFormaCobroTO> = new Array();
  listadoPeriodos: Array<SisPeriodo> = new Array();
  listadoMotivos: Array<InvVentaMotivoComboTO> = new Array();
  listadoBodegas: Array<InvListaBodegasTO> = new Array();
  //PARA NOTAS DE CREDITO Y DEBITO
  listadoTipoComprobante: Array<AnxTipoComprobanteComboTO> = new Array();
  listadoMotivoComplemento: Array<ClaveValor> = new Array();
  anxVentasTO: AnxVentaTO = new AnxVentaTO();
  opcionesDetalle: any = [];

  invVentasTO: InvVentasTO = new InvVentasTO();
  invProductoEtiquetas: InvProductoEtiquetas = new InvProductoEtiquetas();
  caja: CajCajaTO = new CajCajaTO();
  bodegaSeleccionada: InvListaBodegasTO = new InvListaBodegasTO();
  formaCobroSeleccionada: InvVentasFormaCobroTO = new InvVentasFormaCobroTO();
  cliente: InvFunListadoClientesTO = new InvFunListadoClientesTO();
  detalleSeleccionado: InvVentasDetalleTO = new InvVentasDetalleTO();
  motivoSeleccionado: InvVentaMotivoComboTO = new InvVentaMotivoComboTO();
  informacionAdicional: Array<ClaveValor> = new Array();
  etiquetas: any = [];

  filasTiempo: FilasTiempo = new FilasTiempo();
  diasCredito: number = 0; //si se intenta cambiar, no puede ser mayor a la variable cliDiasCredito del cliente seleccionado

  isScreamMd: boolean = true; //pantalla pequeña o grande
  cargando: boolean = false;
  empresaExtranjera: boolean = false;
  activar: boolean = false;
  isClienteValido: boolean = false;
  mostrarAccionesContabilidad: boolean = false; //flag para ocultar o mostrar formulario contabilidad
  mostrarAccionesCliente: boolean = false; //flag para ocultar o mostrar formulario cliente
  documentoValido = true;//si el numero de documento esta vigente o no
  documentoNumeroCopia = null;
  fechaVencimientoValido: boolean = false;
  documentoCaducado: boolean = false;
  esNota: boolean = false;
  puedeEditar: boolean = true;
  contabilizar: boolean = false;
  verContable: boolean = false;

  fechaEmision: Date;//dia que se hace venta
  es: any;//idioma de fechas
  configAutonumeric: AppAutonumeric;
  objetoContableEnviar: any = {};
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public estilos: any = {};

  constructor(
    private auth: AuthService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private ventaService: VentaService,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private piscinaService: PiscinaService,
    public api: ApiRequestService,
    private archivoService: ArchivoService,
    public ventaFormularioService: VentaFormularioService
  ) {
    this.ventaFormularioService.definirAtajosDeTeclado(this);
    this.es = this.utilService.setLocaleDate();
    this.configAutonumeric = this.ventaFormularioService.obtenerAutonumeric();
  }

  ngOnInit() {
    this.cargando = true;
    this.accion = this.parametros.accion;
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.titulo = this.ventaService.obtenerTituloFormulario(this.tipoDocumento);
    if (this.tipoDocumento == '04' || this.tipoDocumento == '05') { //define que sea una nota de credito
      this.esNota = true;
      this.estilos = { 'width': '100%', 'height': 'calc(100vh - 620px)' }
      for (var n in MotivoComplemento) {
        this.listadoMotivoComplemento.push(new ClaveValor({ clave: MotivoComplemento[n], valor: n }));
      }
    } else {
      this.estilos = { 'width': '100%', 'height': 'calc(100vh - 490px)' }
    }
    this.ventaFormularioService.enfocarInput('codCliente');
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.inicializar();
    this.obtenerDatosParaVentas();
  }

  actuarSegunAccionDelPadre(accion) {
    let objetoSeleccionado: InvListaConsultaVentaTO = this.parametros.seleccionado;//Objeto seleccionado
    switch (accion) {
      case LS.ACCION_CONSULTAR:
      case LS.ACCION_ANULAR:
      case LS.ACCION_RESTAURAR:
        if (objetoSeleccionado.conNumero) {
          this.verContable = true;
          this.contabilizar = false;
        } else {
          this.verContable = false;
          this.contabilizar = false;
        }
        this.puedeEditar = false;
        this.consultarVenta(objetoSeleccionado.vtaDocumentoNumero, objetoSeleccionado.vtaDocumentoTipo, objetoSeleccionado.vtaNumero);
        break;
      case LS.ACCION_CREAR:
        this.puedeEditar = true;
        let invVentaDetalle = new InvVentasDetalleTO({ detCantidad: 1.00 });
        this.listaInvVentasDetalleTO.push(invVentaDetalle);
        if (this.caja.permisoFormaPagoPermitida) {
          this.formaCobroSeleccionada = this.ventaFormularioService.seleccionarFormaCobroPorCtaCodigo(this.listadoFormaCobro, this.caja.permisoFormaPagoPermitida);
        } else {
          this.formaCobroSeleccionada = null;
        }
        this.cargando = false;
        break;
      case LS.ACCION_MAYORIZAR:
        if (objetoSeleccionado.conNumero) {
          this.verContable = true;
          this.contabilizar = false;
        } else {
          this.verContable = false;
          this.contabilizar = true;
        }
        this.contabilizar = true;
        this.puedeEditar = true;
        this.consultarVenta(objetoSeleccionado.vtaDocumentoNumero, objetoSeleccionado.vtaDocumentoTipo, objetoSeleccionado.vtaNumero);
        break;
    }
    this.iniciarAgGrid();
  }

  inicializar() {
    this.tipoEmpresa = this.empresaSeleccionada.parametros[0] ? this.empresaSeleccionada.parametros[0].parActividad : "";
    this.invVentasTO = new InvVentasTO();
    this.activar = false;
    this.cliente = new InvFunListadoClientesTO();
    this.fechaVencimientoValido = true;
    //iniciarlizar Venta
    this.listaInvVentasDetalleTO = new Array();
    this.listaInvVentasEliminarDetalleTO = new Array();
  }

  obtenerDatosParaVentas() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      usuarioCodigo: this.auth.getCodigoUser(),
      tipoDocumento: this.tipoDocumento
    }
    this.ventaService.obtenerDatosParaVentas(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosParaVentas(data) {//todo lo que se necesita para hacer ventas
    this.caja = new CajCajaTO(data.caja);
    this.caja.permisoClientePrecioPermitido = data.caja.permisoClientePrecioPermitido;
    this.listadoPeriodos = data.listadoPeriodos;
    this.listadoMotivos = data.listadoMotivos;
    this.listadoBodegas = data.listadoBodegas;
    this.bodegaSeleccionada = this.ventaFormularioService.seleccionarBodega(this.listadoBodegas, this.caja);
    this.listadoTipoComprobante = data.listadoTipoComprobante ? data.listadoTipoComprobante : new Array();
    this.tipoDocumentoComplemento = this.esNota && this.listadoTipoComprobante[0] ? this.listadoTipoComprobante[0].tcCodigo : "";
    data.etiquetas ? this.despuesDeObtenerEtiquetas(data.etiquetas) : this.etiquetaSeleccionada = 'proPorCantidad';;
    this.etiquetaSeleccionada = this.ventaFormularioService.precioSeleccionado(this.caja);
    this.fechaEmision = new Date(data.fechaActual);
    this.listadoPiscinaTO = data.listadoPiscinas;
    this.listadoFormaCobro = data.listadoFormaCobro ? data.listadoFormaCobro : new Array();
    this.invVentasTO = new InvVentasTO(data.venta);
    this.invVentasTO.vtaDocumentoNumero = this.invVentasTO.vtaDocumentoNumero === '' ? null : this.invVentasTO.vtaDocumentoNumero;
    if (this.invVentasTO.fcSecuencial) {
      this.formaCobroSeleccionada = this.ventaFormularioService.seleccionarFormaCobroPorFcSecuencial(this.listadoFormaCobro, this.invVentasTO.fcSecuencial);
    } else {
      this.formaCobroSeleccionada = null;
    }
    this.motivoSeleccionado = this.ventaFormularioService.seleccionarMotivo(this.listadoMotivos, this.invVentasTO);
    this.actuarSegunAccionDelPadre(this.accion);
    if (this.accion === LS.ACCION_CREAR) {
      this.validarNumeroDoc();
    }
  }

  despuesDeObtenerEtiquetas(data) {
    this.invProductoEtiquetas = new InvProductoEtiquetas(data);
    for (let prop in this.invProductoEtiquetas) {
      //Si las propiedades son de precio y los valores no son vacios
      if (prop.toString().indexOf('eprecio') >= 0 && this.invProductoEtiquetas[prop] != "") {
        this.etiquetas.push({ field: prop, value: this.invProductoEtiquetas[prop] });
      }
    }
    // this.etiquetaSeleccionada = 'proPorCantidad';
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    let parametro = {
      empresa: this.empresaSeleccionada,
      accion: LS.ACCION_ACTIVAR,
      estado: activar
    }
    this.enviarAccion.emit(parametro);
  }

  getIVA() {
    let parametro = {
      fechaFactura: this.fechaEmision
    }
    this.ventaService.obtenerIva(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.ventaService.verificarPermiso(accion, this.empresaSeleccionada, mostraMensaje);
  }

  despuesDeObtenerIva(data) {
    this.invVentasTO.vtaIvaVigente = data;
    this.calcularValoresPrecioLista();
  }

  cancelar() {
    let parametro = {
      empresa: this.empresaSeleccionada,
      accion: LS.ACCION_CANCELAR
    }
    switch (this.accion) {
      case LS.ACCION_MAYORIZAR:
      case LS.ACCION_CREAR:
        let parametros = {
          title: LS.MSJ_TITULO_CANCELAR,
          texto: LS.MSJ_PREGUNTA_CANCELAR,
          type: LS.SWAL_QUESTION,
          confirmButtonText: LS.MSJ_SI,
          cancelButtonText: LS.MSJ_NO
        };
        this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
          if (respuesta) {//Si presiona aceptar
            this.enviarAccion.emit(parametro);
          }
        });
        break;
      default:
        this.enviarAccion.emit(parametro);
    }
  }

  ejecutarAccion(event, accion) {
    switch (accion) {
      case LS.ACCION_VER_DETALLE_ITEM_VENTA:
        this.detalleSeleccionado = event;
        this.accionAdicional(this.detalleSeleccionado);
        break;
    }
  }

  cantidadFocusAndEditingCell(index) {
    this.gridApi.setFocusedCell(index, "detCantidad");
    this.gridApi.startEditingCell({ rowIndex: index, colKey: "detCantidad" });
  }

  //abre el modal para ver detalles de la venta
  accionAdicional(detalle, tipo?) {
    tipo = !tipo ? 'detalle' : tipo;
    let permiso = false;
    switch (tipo) {
      case 'precio':
        permiso = detalle && detalle.proCodigoPrincipal && (this.caja.permisoCambiarPrecio || !detalle.catPrecioFijo || !detalle.estadoPrecio) && detalle.estadoProducto;
        break;
      case 'cantidad':
        permiso = detalle && detalle.proCodigoPrincipal && detalle.estadoProducto;
        break;
      default:
        permiso = true;
    }
    if (permiso) {
      this.invVentasTO.vtaInformacionAdicional = this.ventaFormularioService.formatearIformacionAdicional(this.informacionAdicional);
      this.invVentasTO.fcSecuencial = this.formaCobroSeleccionada && this.formaCobroSeleccionada.fcSecuencial ? this.formaCobroSeleccionada.fcSecuencial : null;
      const modalRef = this.modalService.open(ModalVentaDetalleComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
      modalRef.componentInstance.item = detalle;
      modalRef.componentInstance.venta = this.invVentasTO;
      modalRef.componentInstance.anxVentasTO = this.anxVentasTO;
      modalRef.componentInstance.tipo = tipo;
      modalRef.componentInstance.caja = this.caja;
      modalRef.componentInstance.tipoDocumento = this.tipoDocumento;
      modalRef.componentInstance.tipoEmpresa = this.tipoEmpresa;
      modalRef.componentInstance.accion = this.accion;
      modalRef.componentInstance.configAutonumeric = this.configAutonumeric;
      modalRef.componentInstance.listaInvVentasDetalleTO = this.listaInvVentasDetalleTO;
      modalRef.componentInstance.listadoPiscinaTO = this.listadoPiscinaTO;
      modalRef.componentInstance.etiquetaSeleccionada = this.etiquetaSeleccionada;
      modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
      modalRef.componentInstance.fechaEmision = this.fechaEmision;
      modalRef.componentInstance.diasCredito = this.diasCredito;
      modalRef.componentInstance.bodegaSeleccionada = this.bodegaSeleccionada;
      modalRef.componentInstance.motivoSeleccionado = this.motivoSeleccionado;
      modalRef.componentInstance.contexto = this;
      modalRef.result.then((result) => {
        this.ventaFormularioService.refreshGrid(this.gridApi);
        if (result) {
          let parametro = {
            accion: LS.ACCION_CREADO,
            vtaResultante: this.ventaFormularioService.construirObjetoParaPonerloEnLaLista(result, this.cliente),
            empresa: this.empresaSeleccionada
          };
          this.enviarAccion.emit(parametro);
        }
        if (tipo === 'cantidad') {
          var index = this.listaInvVentasDetalleTO.findIndex(item => item.proCodigoPrincipal === this.detalleSeleccionado.proCodigoPrincipal);
          this.gridApi.setFocusedCell(index, 'proCodigoPrincipal');
          this.ventaFormularioService.cantidadFocusAndEditingCell(index, this.gridApi);
        }
      }, () => {
      });
    }
  };

  //RELOAD
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_NUEVO:
      case LS.ACCION_CREAR:
        event.returnValue = false;
        break;
      default:
        return true;
    }
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }

  //Menu
  generarOpciones(seleccionado) {
    let permiso = this.ventaService.verificarPermiso(this.accion, this.empresaSeleccionada, false);
    let permisoVerInfo = seleccionado && seleccionado.proCodigoPrincipal && seleccionado.estadoProducto;
    this.opcionesDetalle = [
      { label: LS.MSJ_VER_DATOS, icon: LS.ICON_INFO_CIRCULO, disabled: !permisoVerInfo, command: () => permisoVerInfo ? this.accionAdicional(seleccionado) : null },
      { label: LS.ACCION_AGREGAR_FILA_ARRIBA, icon: LS.ICON_FLECHA_ARRIBA, disabled: !permiso, command: () => permiso ? this.agregarFila('up', seleccionado) : null },
      { label: LS.ACCION_AGREGAR_FILA_ABAJO, icon: LS.ICON_FLECHA_ABAJO, disabled: !permiso, command: () => permiso ? this.agregarFila('down', seleccionado) : null },
      { label: LS.ACCION_ELIMINAR_FILA, icon: LS.ICON_ELIMINAR, disabled: !permiso, command: () => permiso ? this.eliminarFila(seleccionado) : null },
    ];
  }

  agregarFilaAlFinal(params) {
    this.listaInvVentasDetalleTO = this.ventaFormularioService.agregarFilaAlFinal(params, this.listaInvVentasDetalleTO, this.detalleSeleccionado, this.accion, this.gridApi);
  }

  agregarFila(ubicacion, seleccionado) {
    this.listaInvVentasDetalleTO = this.ventaFormularioService.agregarFila(ubicacion, this.listaInvVentasDetalleTO, seleccionado, this.gridApi);
  }

  refrescarOrdenDetalle(opcion?) {
    let index = 0;
    if (!opcion) {
      this.listaInvVentasDetalleTO.forEach(element => {
        let detalle = element;
        detalle.detOrden = index;
        this.listaInvVentasDetalleTO[index] = detalle;
        index = index + 1;
      });
    }
    //Selecciona el ultimo item
    if (this.listaInvVentasDetalleTO.length > 0) {
      if (opcion === 0) {
        this.detalleSeleccionado = this.listaInvVentasDetalleTO[0];
      } else {
        this.detalleSeleccionado = this.listaInvVentasDetalleTO[this.listaInvVentasDetalleTO.length - 1];
      }
    }
    this.filasService.actualizarFilas(this.listaInvVentasDetalleTO.length);
  }

  eliminarFila(seleccionado) {
    if (this.listaInvVentasDetalleTO.length > 1) {
      let index = this.listaInvVentasDetalleTO.indexOf(seleccionado);
      if (seleccionado && seleccionado.detSecuencia > 0) {
        let parametros = {
          title: LS.MSJ_TITULO_ELIMINAR,
          texto: LS.MSJ_PREGUNTA_ELIMINAR,
          type: LS.SWAL_QUESTION,
          confirmButtonText: LS.MSJ_SI_ACEPTAR,
          cancelButtonText: LS.MSJ_NO_CANCELAR
        }
        this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
          if (respuesta) {//Si presiona aceptar
            this.cargando = true;
            this.listaInvVentasEliminarDetalleTO.push(seleccionado);
            this.quitarElementoDeFila(index);
          }
        });
      } else {
        this.quitarElementoDeFila(index);
      }
    }
  }

  quitarElementoDeFila(index) {
    let listaTemporal = this.listaInvVentasDetalleTO.slice();
    listaTemporal.splice(index, 1);
    this.listaInvVentasDetalleTO = listaTemporal;
    this.ventaFormularioService.calcularValoresVenta(this.invVentasTO, this.listaInvVentasDetalleTO, this.gridApi);
    this.ventaFormularioService.refreshGrid(this.gridApi);
    this.cargando = false;
  }

  //Validaciones
  validarFechaVenc() {//calcular fechaEmision + diasDeCredito de cliente
    if (Number(this.diasCredito) > this.cliente.cliDiasCredito) {
      this.diasCredito = this.cliente.cliDiasCredito;
    }
  }

  validarFechaCaducaNumeroDoc() {
    this.documentoCaducado = true;
    if (this.invVentasTO.vtaDocumentoNumero && this.fechaEmision && this.documentoCaducado) {
      let parametro = {
        empresa: LS.KEY_EMPRESA_SELECT,
        numeroRetencion: this.invVentasTO.vtaDocumentoNumero,
        numeroComprobante: this.tipoDocumento,
        fechaVencimiento: this.utilService.convertirFechaStringYYYYMMDD(this.fechaEmision)
      }
      this.ventaService.validarNumeroAutorizacion(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeValidarNumeroAutorizacion(data) {
    if (data) {
      if (data.numeroAutorizacion === 'CADUCADO') {
        this.documentoCaducado = true;
        this.toastr.warning(LS.MSJ_DOCUMENTO_CADUCADO, LS.TAG_AVISO);
      } else {
        this.documentoCaducado = false;
      }
    }
  }

  validarNumeroDoc() {
    let validarServidor = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      tipoDocumento: this.tipoDocumento,
      numeroDocumento: this.invVentasTO.vtaDocumentoNumero
    }
    if (this.accion === LS.ACCION_MAYORIZAR && this.documentoNumeroCopia === this.invVentasTO.vtaDocumentoNumero) {
      validarServidor = false;
      this.documentoValido = true;
    }
    if (validarServidor && this.invVentasTO.vtaDocumentoNumero) {
      this.ventaService.validarNumero(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeValidarNumero(data) {
    this.documentoValido = data;
    this.validarFechaCaducaNumeroDoc();
  }

  validarCamposObligatorios(): boolean {
    this.motivoSeleccionado = this.motivoSeleccionado ? this.motivoSeleccionado : this.listadoMotivos.find(item => item.vmCodigo == this.invVentasTO.vtaMotivo);
    if (this.bodegaSeleccionada.bodCodigo && this.formaCobroSeleccionada && this.motivoSeleccionado && this.etiquetaSeleccionada) {
      this.invVentasTO.vtaFormaPago = this.formaCobroSeleccionada.fcTipoPrincipal === 'CUENTAS POR COBRAR' ? 'POR PAGAR' : this.formaCobroSeleccionada.fcDetalle;//guardar la forma de pago pos pagar segun el motivo
      this.invVentasTO.ctaCodigo = this.formaCobroSeleccionada.ctaCodigo;//llenamos la cuenta contable de la forma de pago
      this.invVentasTO.ctaEmpresa = this.formaCobroSeleccionada.ctaEmpresa;
      return true;
    }
    return false;
  }

  //Listados
  listarPiscinas() {
    this.invVentasTO.bodCodigo = this.bodegaSeleccionada.bodCodigo;
    this.listadoPiscinaTO = new Array();
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      sector: this.bodegaSeleccionada.codigoCP
    }
    this.piscinaService.listarPrdListaPiscinaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPiscina(data) {
    this.listadoPiscinaTO = data;
    this.cargando = false;
  }

  //Calculos
  calcularTotales(item: InvVentasDetalleTO) {
    item = this.ventaFormularioService.calcularValorItem(item, this.invVentasTO);
    this.invVentasTO = this.ventaFormularioService.calcularValoresVenta(this.invVentasTO, this.listaInvVentasDetalleTO, this.gridApi);
  };

  calcularPrecioLista(listaInvVentasDetalleTO) {
    this.toastr.warning(LS.MSJ_VERIFIQUE_PRECIOS, LS.TOAST_ADVERTENCIA);
    listaInvVentasDetalleTO.forEach(detalle => {
      if (detalle.proCodigoPrincipal) {
        this.establecerValoresDeProducto(detalle);
      }
    });
  };

  calcularValoresPrecioLista() {
    this.listaInvVentasDetalleTO.forEach(element => {
      this.calcularTotales(element);
    });
  };

  //Contable
  verContableVenta() {
    if (this.invVentasTO.conPeriodo && this.invVentasTO.conTipo && this.invVentasTO.conNumero) {
      this.mostrarAccionesContabilidad = true;
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: this.accion,
        contable: this.invVentasTO.conPeriodo + " | " + this.invVentasTO.conTipo + " | " + this.invVentasTO.conNumero,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        volverACargar: true
      };
    } else {
      this.toastr.warning(LS.MSJ_NO_HAY_PARAMETROS_DE_BUSQUEDA, LS.TAG_AVISO);
    }
  }

  cerrarContabilidadAcciones(event) {
    this.activar = event.objetoEnviar ? event.objetoEnviar.activar : this.activar;
    this.cambiarActivar(this.activar);
    this.objetoContableEnviar = event.objetoEnviar;
    this.mostrarAccionesContabilidad = event.mostrarContilidadAcciones;
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.activar = event;
    this.cambiarActivar(this.activar);
  }

  //cliente
  buscarCliente(event) {
    let fueBuscado = this.invVentasTO.cliCodigo != "" && this.invVentasTO.cliCodigo === this.cliente.cliCodigo;
    if (this.utilService.validarKeyBuscar(event.keyCode) && this.invVentasTO.cliCodigo && !fueBuscado) {
      let parametro = {
        empresa: LS.KEY_EMPRESA_SELECT,
        busqueda: this.invVentasTO.cliCodigo,
        mostrarInactivo: false
      }
      event.srcElement.blur();
      event.preventDefault();
      const modalRef = this.modalService.open(ClienteListadoComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.parametros = parametro;
      modalRef.componentInstance.isModal = true;
      modalRef.result.then((result) => {
        if (!result) {
          this.deseaAgregarCliente();
        } else {
          this.cliente = result;
          this.invVentasTO.cliCodigo = this.cliente.cliCodigo;
          this.isClienteValido = true;
          this.diasCredito = this.cliente.cliDiasCredito;
          if (this.caja && this.caja.permisoMotivoPermitido) {
            this.ventaFormularioService.focusedProducto(0, this.gridApi);
          }
          this.ventaFormularioService.enfocarInput('cboMotivo');
        }
      }, (reason) => {
        if (!reason) {
          this.deseaAgregarCliente();
        }
      });
    }
  }

  deseaAgregarCliente() {
    let parametros = {
      title: LS.VENTA,
      texto: LS.MSJ_PREGUNTA_INSERTAR_CLIENTE,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ACEPTAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona aceptar
        this.mostrarFormularioCliente();
      } else {
        this.ventaFormularioService.enfocarInput('codCliente');
      }
    });
  }

  mostrarFormularioCliente() {
    this.mostrarAccionesCliente = true;
    this.parametros.cliente = new InvClienteTO();
    this.parametros.accion = LS.ACCION_NUEVO;
    let codigo = Number(this.invVentasTO.cliCodigo);
    if (codigo) {
      this.parametros.cliente.cliCodigo = codigo;
    } else {
      this.parametros.cliente.cliRazonSocial = this.invVentasTO.cliCodigo;
    }
  }

  validarCliente() {
    this.isClienteValido = false;
    if (this.invVentasTO.cliCodigo !== this.cliente.cliCodigo) {
      this.invVentasTO.cliCodigo = null;
      this.cliente = new InvFunListadoClientesTO();
    }
    if (this.invVentasTO.cliCodigo && this.cliente && (this.invVentasTO.cliCodigo === this.cliente.cliCodigo)) {
      this.isClienteValido = true;
    }
  }

  ejecutarAccionCliente(event) {
    switch (event.accion) {
      case LS.ACCION_REGISTRO_EXITOSO:
        this.cliente = event.cliente;
        this.invVentasTO.cliCodigo = event.cliente.cliCodigo;
        this.diasCredito = this.cliente.cliDiasCredito;
        this.ventaFormularioService.focusedProducto(0, this.gridApi);
        this.isClienteValido = true;
        this.mostrarAccionesCliente = false;
        break;
      case LS.ACCION_REGISTRO_NO_EXITOSO:
        this.mostrarAccionesCliente = false;
        this.ventaFormularioService.enfocarInput('codCliente');
        break;
    }
  }

  //Producto
  buscarProducto(params) {
    let keyCode = params.event.keyCode;
    let codigoProductoInput = params.event.target.value;
    let codigoProducto = params.data.proCodigoPrincipal;
    if (this.utilService.validarKeyBuscar(keyCode)) {
      params.data.proCodigoPrincipal = codigoProductoInput;
      let fueBuscado = (codigoProductoInput === codigoProducto && codigoProductoInput && codigoProducto);
      if (!fueBuscado) {
        codigoProductoInput = codigoProductoInput ? codigoProductoInput.toUpperCase() : null;
        if (codigoProductoInput) {
          let parametroBusquedaProducto = { empresa: this.empresaSeleccionada.empCodigo, busqueda: codigoProductoInput, categoria: null, bodega: this.bodegaSeleccionada ? this.bodegaSeleccionada.bodCodigo : null, incluirInactivos: false, limite: false };
          this.abrirModalProducto(parametroBusquedaProducto, params);
        } else {
          if (keyCode === LS.KEYCODE_TAB) {
            this.ventaFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
          } else {
            this.ventaFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
          }
        }
      } else {
        if (keyCode === LS.KEYCODE_TAB) {
          this.ventaFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
        } else {
          this.ventaFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
        }
      }
    }
  }

  abrirModalProducto(parametroBusquedaProducto, params) {
    if (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_EDITAR || this.accion === LS.ACCION_MAYORIZAR) {
      const modalRef = this.modalService.open(ListadoProductosComponent, { size: 'lg', backdrop: 'static', windowClass: 'miSize' });
      modalRef.componentInstance.parametrosBusqueda = parametroBusquedaProducto;
      modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
      modalRef.componentInstance.isModal = true;
      modalRef.result.then((result) => {
        if (result) {
          let resultado = new InvListaProductosGeneralTO(result);
          params.event.target.value = resultado.proCodigoPrincipal;
          params.data.estadoProducto = true;
          params.data.proCodigoPrincipal = resultado.proCodigoPrincipal;
          params.data.proEmpresa = this.empresaSeleccionada.empCodigo
          params.data.proNombre = resultado.proNombre;
          params.data.proMedida = resultado.detalleMedida;
          params.data.proEstadoIva = resultado.proGravaIva;
          params.data.proCodigoPrincipalCopia = resultado.proCodigoPrincipal;
          var rowNode = this.gridApi.getRowNode(params.node.rowIndex);
          rowNode.setData(params.data);
          this.establecerValoresDeProducto(params.data);
          this.ventaFormularioService.cantidadFocusAndEditingCell(params.node.rowIndex, this.gridApi);
        } else {
          this.ventaFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
        }
      }, () => {
        params.data.proCodigoPrincipal = "";
        this.validarProducto(params.data);
        this.gridApi.setFocusedCell(params.node.rowIndex, 'proNombre');
        this.ventaFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
      });
    }
  }

  validarProducto(detalle: InvVentasDetalleTO): boolean {
    if (detalle.proCodigoPrincipal !== detalle.proCodigoPrincipalCopia) {
      this.resetearProducto(detalle);
      return false;
    }
    return true;
  }

  resetearProducto(detalle) {
    detalle.proCodigoPrincipalCopia = null;//Se borra la copia
    detalle.proCodigoPrincipal = null;
    detalle.proNombre = null;
    detalle.proMedida = null;
    detalle.estadoProducto = false;
    this.refreshGrid();
  }

  establecerValoresDeProducto(detalle: InvVentasDetalleTO) {
    let campoCostoRerefencia = this.ventaService.obtenerCampoDesdeReferencia(this.etiquetaSeleccionada);
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      codigoProducto: detalle.proCodigoPrincipal
    }
    this.api.post("todocompuWS/inventarioWebController/buscarInvProductoDAOTO", parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        if (data && data.extraInfo) {
          detalle.detPrecio = this.utilService.convertirNDecimale(0, 6);
          let producto = new InvProductoDAOTO(data.extraInfo);
          detalle.catPrecioFijo = producto.catPrecioFijo;
          detalle.conversion = this.utilService.convertirNDecimale(producto.proFactorCajaSacoBulto, 6);
          if (this.empresaSeleccionada.parametros[0].parEscogerPrecioPor === "CANTIDAD" || !campoCostoRerefencia) {
            parametro['cliente'] = this.cliente.cliCodigo;
            parametro['cantidad'] = detalle.detCantidad;
            this.api.post("todocompuWS/inventarioWebController/getPrecioProductoPorCantidad", parametro, LS.KEY_EMPRESA_SELECT)
              .then(data => {
                if (data && data.extraInfo) {
                  detalle.detPrecio = this.utilService.convertirNDecimale(data.extraInfo, 6);
                } else {
                  detalle.detPrecio = this.utilService.convertirNDecimale(producto[campoCostoRerefencia], 6);
                }
                detalle.estadoPrecio = detalle.detPrecio > 0 ? true : false;
                this.calcularTotales(detalle);
              }
              ).catch(err => this.utilService.handleError(err, this));
          } else {
            detalle.detPrecio = this.utilService.convertirNDecimale(producto[campoCostoRerefencia], 6);
            detalle.estadoPrecio = detalle.detPrecio > 0 ? true : false;
            this.calcularTotales(detalle);
          }
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_ADVERTENCIA);
          this.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this))
  }

  validarAntesDeEnviar(form: NgForm): boolean {
    let valido = true;
    let formTouched = this.utilService.establecerFormularioTocado(form);
    let detalleValidado = this.validarDetalle();
    let informAdicValido = this.ventaService.validarInformacionAdicional(this.informacionAdicional);
    let listadoDetalle = this.getRowData();
    if (!(formTouched && form && form.valid && detalleValidado && informAdicValido && this.documentoValido && !this.documentoCaducado && this.validarCamposObligatorios())) {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      valido = false;
    } else if (listadoDetalle.length === 0) {
      this.toastr.error(LS.MSJ_INGRESE_DATOS_DETALLE, LS.MSJ_TITULO_INVALIDOS);
      valido = false;
    }
    return valido;
  }

  validarDetalle(): boolean {
    let esValido = true;
    if (this.gridApi) {
      this.gridApi.forEachNode((node) => {
        let cantidadSolicitadaValido = this.ventaService.validarCantidad(node.data) && this.ventaService.validarProducto(node.data) && this.ventaService.validarPrecio(node.data);
        !cantidadSolicitadaValido ? esValido = false : null;
      });
    }
    return esValido;
  }

  getRowData(): Array<InvVentasDetalleTO> {
    var rowData = [];
    if (this.gridApi) {
      this.gridApi.forEachNode(function (node) {
        rowData.push(node.data);
      });
    }
    return rowData;
  }

  //Operaciones
  guardarVenta(form: NgForm, estado) {
    this.invVentasTO.vtaPendiente = estado;
    if (this.validarAntesDeEnviar(form)) {
      this.accionAdicional(null, 'cambio');
    }
  }

  anularVenta() {
    let parametro = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ANULAR_VENTA,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ANULAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametro).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        this.invVentasTO = this.ventaFormularioService.formatearVenta(this.invVentasTO, this);
        this.invVentasTO.vtaAnulado = true;
        let listaDetalle = this.ventaFormularioService.formatearVentaDetalle(this.listaInvVentasDetalleTO, this.invVentasTO, this.bodegaSeleccionada);
        let motivoAnulacion: InvVentasMotivoAnulacion = new InvVentasMotivoAnulacion();
        motivoAnulacion.anuComentario = "VENTA ANULADA DESDE LA APLICACION WEB";
        motivoAnulacion.invVentas = null
        let parametro = {
          invVentasTO: new InvVentasTO(this.invVentasTO),
          listaInvVentasDetalleTO: listaDetalle,
          anxVentasTO: this.anxVentasTO,
          invVentasMotivoAnulacion: motivoAnulacion
        }
        this.ventaService.modificarVenta(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  restaurarVenta() {
    if (this.ventaService.verificarPermiso(LS.ACCION_RESTAURAR, this.empresaSeleccionada)) {
      if (this.anxVentasTO && (this.anxVentasTO.venBase0 !== this.invVentasTO.vtaBase0 || this.anxVentasTO.venBaseImponible !== this.invVentasTO.vtaBaseImponible)) {
        this.toastr.warning(LS.MSJ_NO_RESTAURO_VENTA_POR_RETENCION_CAMBIADA, LS.TAG_AVISO);
      } else {
        this.cargando = true;
        this.invVentasTO = this.ventaFormularioService.formatearVenta(this.invVentasTO, this);
        let listaDetalle = this.ventaFormularioService.formatearVentaDetalle(this.listaInvVentasDetalleTO, this.invVentasTO, this.bodegaSeleccionada);
        let parametro = {
          invVentasTO: new InvVentasTO(this.invVentasTO),
          listaInvVentasDetalleTO: listaDetalle,
          anxVentasTO: this.anxVentasTO,
          tipoDocumentoComplemento: this.tipoDocumentoComplemento,
          numeroDocumentoComplemento: this.numeroDocumentoComplemento,
          quitarAnulado: true
        }
        this.ventaService.modificarVenta(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    } else {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.TAG_AVISO);
    }
  }

  consultarVenta(numeroDocumentoComplemento, tipoDocumento, vtaNumero) {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      numeroDocumento: numeroDocumentoComplemento,
      vtaNumero: vtaNumero,
      tipoDocumento: this.accion === LS.ACCION_CREAR ? this.tipoDocumentoComplemento : tipoDocumento
    };
    this.cargando = true;
    this.ventaService.consultarVenta(parametro, this, LS.KEY_EMPRESA_SELECT);
  };

  despuesDeConsultarVenta(data) {
    this.diasCredito = data.diasCredito;
    this.invVentasTO = data.ventasTO;
    this.anxVentasTO = data.anxVentasTO;
    this.listaInvVentasDetalleTO = data.listaInvVentasDetalleTO;
    this.cliente = new InvFunListadoClientesTO(data.cliente);
    this.bodegaSeleccionada = this.listadoBodegas.find(item => item.bodCodigo == this.invVentasTO.bodCodigo);
    this.bodegaSeleccionada = this.bodegaSeleccionada ? this.bodegaSeleccionada : new InvListaBodegasTO();
    //Para nota de crédito
    if (this.tipoDocumentoComplemento === '00' && !this.numeroDocumentoComplemento) {
      this.tipoDocumentoComplemento = this.esNota && data.invVentasComplemento ? data.invVentasComplemento.comDocumentoTipo : ""; //Tipo de documento (nota de crédito)
      this.numeroDocumentoComplemento = this.esNota && data.invVentasComplemento ? data.invVentasComplemento.comDocumentoNumero : ""; //Número de documento (nota de crédito)
      this.motivoComplemento = this.esNota && data.invVentasComplemento ? data.invVentasComplemento.comDocumentoMotivo : "";
    }
    this.formaCobroSeleccionada = this.listadoFormaCobro.find(item => item.fcSecuencial == this.invVentasTO.fcSecuencial);
    this.formaCobroSeleccionada = this.formaCobroSeleccionada ? this.formaCobroSeleccionada : new InvVentasFormaCobroTO();
    this.etiquetaSeleccionada = this.invVentasTO.vtaListaDePrecios;
    this.fechaEmision = typeof this.invVentasTO.vtaFecha === "string" ? this.utilService.fomatearFechaString(this.invVentasTO.vtaFecha, "YYYY-MM-DD") : new Date(this.invVentasTO.vtaFecha);
    if (this.listaInvVentasDetalleTO && this.listaInvVentasDetalleTO.length > 0) {
      for (let i = 0; i < this.listaInvVentasDetalleTO.length; i++) {
        this.listaInvVentasDetalleTO[i].estadoProducto = true;
        this.listaInvVentasDetalleTO[i].proCodigoPrincipalCopia = this.listaInvVentasDetalleTO[i].proCodigoPrincipal;
        this.listaInvVentasDetalleTO[i] = this.ventaFormularioService.calcularValorItem(this.listaInvVentasDetalleTO[i], this.invVentasTO);
      }
    }
    this.listadoPeriodos = this.parametros && this.parametros.listadoPeriodos ? this.parametros.listadoPeriodos : this.listadoPeriodos;
    this.cargando = false;
    if (this.accion === LS.ACCION_MAYORIZAR) {
      this.documentoValido = true;
      this.documentoNumeroCopia = this.invVentasTO.vtaDocumentoNumero;
    }
  };

  contabilizarVenta() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      periodo: this.invVentasTO.vtaPeriodo,
      motivo: this.invVentasTO.vtaMotivo,
      ventaNumero: this.invVentasTO.vtaNumero,
      codigoUsuario: this.auth.getCodigoUser()
    };
    this.ventaService.contabilizar(parametro, this);
  }

  despuesDeContabilizarVenta(mensaje) {
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: mensaje + '<br>' + LS.MSJ_PREGUNTA_VER_CONTABLE,
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_VER + "'></i>  " + LS.ACCION_VER_CONTABLE,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.verContableVenta();
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeModificarVenta(data) {
    if (this.accion === LS.ACCION_RESTAURAR) {
      this.invVentasTO.vtaAnulado = false;
    }
    this.cargando = false;
    let parametro = {
      accion: LS.ACCION_CREADO,
      vtaResultante: this.ventaFormularioService.construirObjetoParaPonerloEnLaLista(this.invVentasTO, this.cliente),
      empresa: this.empresaSeleccionada
    };
    this.enviarAccion.emit(parametro);
    this.utilService.generarSwal(LS.VENTA, LS.SWAL_SUCCESS, data.operacionMensaje);
  }

  imprimirVenta() {
    this.cargando = true;
    let listaDetalle = this.ventaFormularioService.formatearVentaDetalle(this.listaInvVentasDetalleTO, this.invVentasTO, this.bodegaSeleccionada);
    let parametro = {
      invVentasTO: new InvVentasTO(this.invVentasTO),
      listaInvVentasDetalleTO: listaDetalle,
      isComprobanteElectronica: false,
      nombreReporte: "reportComprobanteVenta"
    }
    this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteVentaDetalleImpresion", parametro, this.empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta._body && respuesta._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('venta' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }
  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.ventaService.generarColumnasDetalle(this);
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      popOverInformacion: PopOverInformacionComponent,
      inputLabelCell: InputLabelCellComponent,
      inputNumeric: InputNumericConBotonComponent,
      labelNumeric: LabelNumericConBotonComponent
    };
    this.components = {};
  };

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.gridApi.sizeColumnsToFit();
    this.ventaFormularioService.calcularValoresVenta(this.invVentasTO, this.listaInvVentasDetalleTO, this.gridApi);
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

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    let columna = filasFocusedCell ? filasFocusedCell.column : null;
    let colDef = columna ? columna.getColDef() : null;
    if (colDef && colDef.editable) {
      this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
    }
    this.detalleSeleccionado = fila ? fila.data : null;
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    if (this.puedeEditar) {
      this.detalleSeleccionado = data;
      this.generarOpciones(this.detalleSeleccionado);
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  alCambiarValorDeCelda(event) {
    //Si finalizo de editar el codigo de producto, validar el codigo principal
    if (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_MAYORIZAR) {
      if (event.colDef.field === "proCodigoPrincipal") {
        this.validarProducto(event.data);
      }
      if (event.colDef.field === "detCantidad") {
        this.calcularTotales(event.data);
      }
      if (event.colDef.field === "detPrecio") {
        this.calcularTotales(event.data);
      }
    }
  }
  //#endregion

}
