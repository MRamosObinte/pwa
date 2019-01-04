import { Component, OnInit, EventEmitter, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { CajCajaTO } from '../../../../entidadesTO/caja/CajCajaTO';
import { SisListaUsuarioTO } from '../../../../entidadesTO/sistema/SisListaUsuarioTO';
import { InvVentaMotivoComboTO } from '../../../../entidadesTO/inventario/InvVentaMotivoComboTO';
import { AnxTipoComprobanteComboTO } from '../../../../entidadesTO/anexos/AnxTipoComprobanteComboTO';
import { InvComboBodegaTO } from '../../../../entidadesTO/inventario/InvComboBodegaTO';
import { ComboGenericoTO } from '../../../../enums/ComboGenericoTO';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { MotivoVentasService } from '../../../inventario/archivo/motivo-ventas/motivo-ventas.service';
import { TipoDocumentoService } from '../../../anexos/archivo/tipo-documento/tipo-documento.service';
import { BodegaService } from '../../../inventario/archivo/bodega/bodega.service';
import { InvProductoEtiquetas } from '../../../../entidades/inventario/InvProductoEtiquetas';
import { FormaCobroService } from '../../../inventario/archivo/forma-cobro/forma-cobro.service';
import { InvVentasFormaCobroTO } from '../../../../entidadesTO/inventario/InvVentasFormaCobroTO';
import { PerfilFacturacionService } from '../../archivo/perfil-facturacion/perfil-facturacion.service';
import { NgForm } from '../../../../../../node_modules/@angular/forms';
import { HotkeysService, Hotkey } from '../../../../../../node_modules/angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ProductoEtiquetasService } from '../../../inventario/componentes/producto-etiquetas/producto-etiquetas.service';

@Component({
  selector: 'app-perfil-facturacion-formulario',
  templateUrl: './perfil-facturacion-formulario.component.html',
  styleUrls: ['./perfil-facturacion-formulario.component.css']
})
export class PerfilFacturacionFormularioComponent implements OnInit, OnChanges {

  @Input() data: any;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Output() enviarCancelar: EventEmitter<any> = new EventEmitter();
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  @Output() enviarLista: EventEmitter<any> = new EventEmitter();
  public vistaFormulario: boolean = true;
  public constantes: any;
  public cargando: boolean = false;
  public activar: boolean = false;
  public accion: string = null;//Bandera
  public isScreamMd: boolean; //Bandera para indicar el tamaño de la pantalla
  public frmTitulo: String; //Titulo de formulario
  public cajCajaTO: CajCajaTO = new CajCajaTO();
  public archivoPerfil: FormData = null;
  public archivoPerfilByte: any = null;
  //Combos
  public listaUsuarios: Array<SisListaUsuarioTO> = new Array();
  public usuarioSeleccionado: SisListaUsuarioTO = null;
  public usuarioCopia: SisListaUsuarioTO = null;
  public listaMotivoVenta: Array<InvVentaMotivoComboTO> = new Array();
  public motivoVentaSeleccionado: InvVentaMotivoComboTO = null;
  public motivoVentaCopia: InvVentaMotivoComboTO = null;
  public listaTipoComprobante: Array<AnxTipoComprobanteComboTO> = new Array();
  public tipoComprobanteSeleccionado: AnxTipoComprobanteComboTO = null;
  public tipoComprobanteCopia: AnxTipoComprobanteComboTO = null;
  public listaBodega: Array<InvComboBodegaTO> = new Array();
  public bodegaSeleccionada: InvComboBodegaTO = null;
  public bodegaCopia: InvComboBodegaTO = null;
  public listaPrecioventa: Array<ComboGenericoTO> = new Array();
  public precioVentaSeleccionada: ComboGenericoTO = null;
  public precioVentaCopia: ComboGenericoTO = null;
  public invProductoEtiquetas: InvProductoEtiquetas = new InvProductoEtiquetas();
  public listaFormaCobro: Array<InvVentasFormaCobroTO> = new Array();
  public formaCobroSeleccionado: InvVentasFormaCobroTO = null;
  public formaCobroCopia: InvVentasFormaCobroTO = null;

  constructor(
    private utilService: UtilService,
    private api: ApiRequestService,
    private toastr: ToastrService,
    private motivoVentaService: MotivoVentasService,
    private tipoDocumentoService: TipoDocumentoService,
    private bodegaService: BodegaService,
    private etiquetasService: ProductoEtiquetasService,
    private formaCobroService: FormaCobroService,
    private perfilFacturacionService: PerfilFacturacionService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService
  ) {
    this.constantes = LS; //Hace referncia a los constantes
  }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.iniciarAtajos();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.reiniciarValores();
      this.iniciarFormulario();
    }
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarPerfilFacturacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarPerfilFacturacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      this.cancelarAccion();
      return false;
    }));
  }

  reiniciarValores() {
    this.cajCajaTO = new CajCajaTO();
    this.activar = false;
    this.frmTitulo = "";
    this.vistaFormulario = false;
    this.motivoVentaCopia = null;
    this.tipoComprobanteCopia = null;
    this.bodegaCopia = null;
    this.precioVentaCopia = null;
    this.formaCobroCopia = null;
  }

  iniciarFormulario() {
    if (this.empresaSeleccionada && this.data && this.data.accion) {
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.accion = this.data.accion;
      switch (this.accion) {
        case LS.ACCION_CREAR: {
          this.crearPerfilFacturacion();
          break;
        }
        case LS.ACCION_CONSULTAR: {
          this.consultarPerfilFacturacion();
          break;
        }
        case LS.ACCION_EDITAR: {
          this.editarPerfilFacturacion();
          break;
        }
      }
    }
  }

  crearPerfilFacturacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      this.frmTitulo = LS.TITULO_FORM_NUEVO_CAJA;
      this.obtenerDatosPerfilFacturacion();
    }
  }

  consultarPerfilFacturacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      this.frmTitulo = LS.TITULO_FORM_CONSULTAR_CAJA;
      this.obtenerDatosPerfilFacturacion();
    }
  }

  editarPerfilFacturacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      this.frmTitulo = LS.TITULO_FORM_EDITAR_CAJA;
      this.obtenerDatosPerfilFacturacion();
    }
  }

  obtenerDatosPerfilFacturacion() {
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, cajCajaPK: this.data.cajCajaPK ? this.data.cajCajaPK : null };
    this.api.post("todocompuWS/cajaWebController/getDatosPerfilFacturacion", parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        if (data && data.extraInfo && data.estadoOperacion === LS.KEY_EXITO) {
          this.cargarDatos(data.extraInfo);
        } else {
          this.cargando = false;
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO)
          this.cerrarFormulario();//Se cierra el formulario
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  cargarDatos(respuesta) {
    if ((this.accion === LS.ACCION_CONSULTAR || this.accion === LS.ACCION_EDITAR) && respuesta.cajCajaTO) {
      this.cajCajaTO = respuesta.cajCajaTO;
      this.motivoVentaCopia = this.cajCajaTO.permisoMotivoPermitido ? new InvVentaMotivoComboTO({ vmCodigo: this.cajCajaTO.permisoMotivoPermitido }) : null;
      this.tipoComprobanteCopia = this.cajCajaTO.permisoDocumentoPermitido ? new AnxTipoComprobanteComboTO({ tcCodigo: this.cajCajaTO.permisoDocumentoPermitido }) : null;
      this.bodegaCopia = this.cajCajaTO.permisoBodegaPermitida ? new InvComboBodegaTO({ bodCodigo: this.cajCajaTO.permisoBodegaPermitida }) : null;
      this.precioVentaCopia = this.cajCajaTO.permisoClientePrecioPermitido || this.cajCajaTO.permisoClientePrecioPermitido === 0 ? new ComboGenericoTO({ value: this.cajCajaTO.permisoClientePrecioPermitido.toString() }) : null;
      this.formaCobroCopia = this.cajCajaTO.permisoFormaPagoPermitida ? new InvVentasFormaCobroTO({ ctaCodigo: this.cajCajaTO.permisoFormaPagoPermitida }) : null;
      this.formatearSelect(respuesta);
      this.mostrarFormulario();
    } else if (this.accion === LS.ACCION_CREAR) {
      this.formatearSelect(respuesta);
      this.mostrarFormulario();
    }
    this.cargando = false;
  }

  formatearSelect(respuesta) {
    //Formatear combos
    this.despuesDeListarUsuariosResponsables(respuesta.listaSisListaUsuarioTO);
    this.despuesDeListarVentaMotivoComboTO(respuesta.listaInvVentaMotivoComboTO);
    this.despuesDeListarAnxTipoComprobanteComboTO(respuesta.listaAnxTipoComprobanteComboTO);
    this.despuesDeListarInvComboBodegaTO(respuesta.listaInvComboBodegaTO);
    this.despuesDeObtenerEtiquetas(respuesta.invProductoEtiquetas);
    this.despuesDeListarInvListarInvVentasFormaCobroTO(respuesta.listaInvVentasFormaCobroTO);
  }

  mostrarFormulario() {
    this.vistaFormulario = true;
    this.cambiarActivar();//Se maximixa el formulario
    this.actualizarFilas();
  }

  cerrarFormulario() {
    this.enviarCancelar.emit();
  }

  cambiarActivar() {
    this.activar = !this.activar;
    this.enviarActivar.emit({ 'activar': this.activar, 'deshabilitarOpciones': true, 'vistaListado': false });
  }

  enviarObjetoAListaCerrar(cajCajaTO: CajCajaTO) {
    switch (this.accion) {
      case LS.ACCION_CREAR: {
        this.enviarLista.emit({ objeto: cajCajaTO, accion: LS.LST_INSERTAR });
        break;
      }
      case LS.ACCION_EDITAR: {
        this.enviarLista.emit({ objeto: cajCajaTO, accion: LS.LST_ACTUALIZAR });
        break;
      }
    }
  }

  cancelarAccion() {
    if (this.accion === LS.ACCION_CONSULTAR) {
      this.cerrarFormulario();
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
          this.cerrarFormulario();
        }
      });
    }
  }

  establecerArchivoElectronico(event) {
    if (event && event.files && event.files[0].name.toString().endsWith('.p12')) {
      this.archivoPerfil = new FormData();
      this.archivoPerfil.append('archivoFirma', event.files[0]);
      this.cajCajaTO.cajaCertificadoFirmaDigitalNombre = event.files[0].name;

      var reader = new FileReader();
      reader.onload = (e) => {
        this.archivoPerfilByte = reader.result;
      }
      reader.readAsDataURL(event.files[0]);
    }else{
      this.limpiarArchivoElectronico();
    }
  }

  limpiarArchivoElectronico() {
    this.archivoPerfil = null;
    this.cajCajaTO.cajaCertificadoFirmaDigitalNombre = "";
    this.archivoPerfilByte = null;
  }

  validarAntesDeEnviar(form: NgForm) {
    let validado = true;
    let formTouched = this.utilService.establecerFormularioTocado(form);
    if (this.cajCajaTO.cajaCertificadoFirmaDigitalClave && !this.cajCajaTO.cajaCertificadoFirmaDigitalNombre) {
      this.toastr.warning(LS.MSJ_SELECCIONE_ARCHIVO, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    } else if (!form || !formTouched || !form.valid) {
      this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    }
    this.cargando = validado;
    return validado;
  }

  guardarPerfilFacturacion(form: NgForm) {
    this.cargando = true;
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true) && this.validarAntesDeEnviar(form)) {
      if (this.archivoPerfil) {
        this.guardarArchivoFirmaElectronica();
      } else {
        this.insertarCaja("");
      }
    }
  }

  guardarArchivoFirmaElectronica(){
    let parametro = { archivoBase64: this.archivoPerfilByte, nombreArchivo: this.cajCajaTO.cajaCertificadoFirmaDigitalNombre }
    this.api.post("todocompuWS/sistemaWebController/guardarArchivoFirmaElectronica", parametro, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO && respuesta.extraInfo) {
          this.accion === LS.ACCION_CREAR ? this.insertarCaja(respuesta.operacionMensaje): this.actualizarCaja(respuesta.operacionMensaje); 
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          this.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, this));
  }

  insertarCaja(mensaje) {
    let cajCajaTOCopia = this.perfilFacturacionService.formatearCajCajaTO(this.cajCajaTO, this);
    let parametro = { cajCajaTO: cajCajaTOCopia, accion: 'I' };
    this.api.post("todocompuWS/cajaWebController/accionCajCajaTO", parametro, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO && respuesta.extraInfo) {
          this.cargando = false;
          let mensajeFinal = mensaje + '<br>' + respuesta.operacionMensaje;
          this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK)
            .then(respuesta => {
              this.enviarObjetoAListaCerrar(cajCajaTOCopia);
            });
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          this.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, this));
  }

  actualizarPerfilFacturacion(form: NgForm) {
    this.cargando = true;
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true) && this.validarAntesDeEnviar(form)) {
      if (this.archivoPerfil) {
        this.guardarArchivoFirmaElectronica();
      } else {
        this.actualizarCaja("");
      }
    }
  }

  actualizarCaja(mensaje) {
    let cajCajaTOCopia = this.perfilFacturacionService.formatearCajCajaTO(this.cajCajaTO, this);
    let parametro = { cajCajaTO: cajCajaTOCopia, accion: 'U' };
    this.api.post("todocompuWS/cajaWebController/accionCajCajaTO", parametro, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO && respuesta.extraInfo) {
          this.cargando = false;
          let mensajeFinal = mensaje + '<br>' + respuesta.operacionMensaje;
          this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK)
            .then(respuesta => {
              this.enviarObjetoAListaCerrar(cajCajaTOCopia);
            });
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          this.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, this));
  }

  //#region [R1] Combos Reload data
  listarUsuariosResponsables() {
    this.cargando = true;
    this.listaUsuarios = [];
    this.usuarioCopia = this.usuarioSeleccionado;//Guarda el seleccionado
    this.usuarioSeleccionado = null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.perfilFacturacionService.listarUsuariosResponsables(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarUsuariosResponsables(data) {
    this.listaUsuarios = data;
    this.usuarioSeleccionado = this.utilService.getObjetoSeleccionadoComboOpcional(this.listaUsuarios, this.usuarioCopia, 'usrCodigo');
    this.cargando = false;
  }

  listarMotivoVenta() {
    this.cargando = true;
    this.listaMotivoVenta = [];
    this.motivoVentaCopia = this.motivoVentaSeleccionado;//Guarda el seleccionado
    this.motivoVentaSeleccionado = null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, filtrarInactivos: false };
    this.motivoVentaService.listarVentaMotivoComboTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarVentaMotivoComboTO(data) {
    this.listaMotivoVenta = data;
    this.motivoVentaSeleccionado = this.utilService.getObjetoSeleccionadoComboOpcional(this.listaMotivoVenta, this.motivoVentaCopia, 'vmCodigo');
    this.cargando = false;
  }

  listarDocumentos() {
    this.cargando = true;
    this.listaTipoComprobante = [];
    this.tipoComprobanteCopia = this.tipoComprobanteSeleccionado;//Guarda el seleccionado
    this.tipoComprobanteSeleccionado = null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, codigoTipoTransaccion: null };
    this.tipoDocumentoService.listarAnxTipoComprobanteComboTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarAnxTipoComprobanteComboTO(data) {
    this.listaTipoComprobante = data;
    this.tipoComprobanteSeleccionado = this.utilService.getObjetoSeleccionadoComboOpcional(this.listaTipoComprobante, this.tipoComprobanteCopia, 'tcCodigo');
    this.cargando = false;
  }

  listarBodegas() {
    this.cargando = true;
    this.listaBodega = [];
    this.bodegaCopia = this.bodegaSeleccionada;//Guarda el seleccionado
    this.bodegaSeleccionada = null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.bodegaService.listarInvComboBodegaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvComboBodegaTO(data) {
    this.listaBodega = data;
    this.bodegaSeleccionada = this.utilService.getObjetoSeleccionadoComboOpcional(this.listaBodega, this.bodegaCopia, 'bodCodigo');
    this.cargando = false;
  }

  obtenerEtiquetas() {
    this.cargando = true;
    this.listaPrecioventa = [];
    this.precioVentaCopia = this.precioVentaSeleccionada;
    this.precioVentaSeleccionada = null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.invProductoEtiquetas = new InvProductoEtiquetas();
    this.etiquetasService.obtenerEtiquetas(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerEtiquetas(data) {
    this.invProductoEtiquetas = new InvProductoEtiquetas(data);
    let listaTemporal = [new ComboGenericoTO({ value: '0', label: LS.LABEL_POR_CANTIDAD })];
    for (let prop in this.invProductoEtiquetas) {
      //Si las propiedades son de costo y los valores no son vacios
      if (prop.toString().indexOf('eprecio') >= 0 && this.invProductoEtiquetas[prop] != "") {
        let value = Number(prop.toString().split('eprecio')[1]).toString();
        listaTemporal.push(new ComboGenericoTO({ value: value, label: this.invProductoEtiquetas[prop] }));
      }
    }
    this.listaPrecioventa = listaTemporal.slice();
    this.precioVentaSeleccionada = this.utilService.getObjetoSeleccionadoComboOpcional(this.listaPrecioventa, this.precioVentaCopia, 'value');
    this.cargando = false;
  }

  listarFormasCobro() {
    this.cargando = true;
    this.listaFormaCobro = [];
    this.formaCobroCopia = this.formaCobroSeleccionado;//Guarda el seleccionado
    this.formaCobroSeleccionado = null;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivos: false };
    this.formaCobroService.listarInvListaInvVentasFormaCobroTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvListarInvVentasFormaCobroTO(data) {
    this.listaFormaCobro = data;
    this.formaCobroSeleccionado = this.utilService.getObjetoSeleccionadoComboOpcional(this.listaFormaCobro, this.formaCobroCopia, 'ctaCodigo');
    this.cargando = false;
  }
  //#endregion

  actualizarFilas() {
    this.filasService.actualizarFilas(0, 0);
  }
}
