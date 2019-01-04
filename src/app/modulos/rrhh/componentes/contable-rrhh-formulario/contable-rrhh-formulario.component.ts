import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import swal from 'sweetalert2';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ListaConContableTO } from '../../../../entidadesTO/contabilidad/ListaConContableTO';
import { ContextMenu } from 'primeng/contextmenu';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { ContableListadoService } from '../../../contabilidad/transacciones/contable-listado/contable-listado.service';
import { RhListaEmpleadoLoteTO } from '../../../../entidadesTO/rrhh/RhListaEmpleadoLoteTO';
import { RhAnticipo } from '../../../../entidades/rrhh/RhAnticipo';
import { RhFunUtilidadesCalcularTO } from '../../../../entidadesTO/rrhh/RhFunUtilidadesCalcularTO';
import { RhUtilidades } from '../../../../entidades/rrhh/RhUtilidades';
import { ContableRrhhFormularioService } from './contable-rrhh-formulario.service';
import { RhComboFormaPagoBeneficioSocialTO } from '../../../../entidadesTO/rrhh/RhComboFormaPagoBeneficioSocialTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { RhComboFormaPagoTO } from '../../../../entidadesTO/rrhh/RhComboFormaPagoTO';
import { RhListaBonosLoteTO } from '../../../../entidadesTO/rrhh/RhListaBonosLoteTO';
import { RhListaBonoConceptoTO } from '../../../../entidadesTO/rrhh/RhListaBonoConceptoTO';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { RhBono } from '../../../../entidades/rrhh/RhBono';
import { RhxivSueldoxivSueldoCalcular } from '../../../../entidadesTO/rrhh/RhXivSueldoXivSueldoCalcular';
import { RhXivSueldo } from '../../../../entidades/rrhh/RhXivSueldo';
import { RhXiiiSueldo } from '../../../../entidades/rrhh/RhXiiiSueldo';
import { RhXiiiSueldoXiiiSueldoCalcular } from '../../../../entidadesTO/rrhh/RhXiiiSueldoXiiiSueldoCalcular';
import { RhRol } from '../../../../entidades/rrhh/RhRol';
import { RhPrestamo } from '../../../../entidades/rrhh/RhPrestamo';
import { RhPrestamoMotivo } from '../../../../entidades/rrhh/RhPrestamoMotivo';

@Component({
  selector: 'app-contable-rrhh-formulario',
  templateUrl: './contable-rrhh-formulario.component.html'
})
export class ContableRrhhFormularioComponent implements OnInit {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  @Input() data;
  @Output() cerrarContabilidadAcciones = new EventEmitter();
  @Output() activarEstado = new EventEmitter();
  @Output() mostrarFormulario = new EventEmitter();

  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  //listas ue van a ser transformadas
  public listadoAnticipos: Array<RhListaEmpleadoLoteTO> = new Array();
  public listadoRhAnticipo: Array<RhAnticipo> = new Array();

  public listadoUtilidades: Array<RhFunUtilidadesCalcularTO> = new Array();
  public listadoRhUtilidades: Array<RhUtilidades> = new Array();

  public listaResultadoBonos: Array<RhListaBonosLoteTO> = new Array();
  public listadoRhBono: Array<RhBono> = new Array();

  public listaResultadoXivSueldo: Array<RhxivSueldoxivSueldoCalcular> = new Array();
  public listadoXivSueldo: Array<RhXivSueldo> = new Array();

  public listaResultadoXiiiSueldo: Array<RhXiiiSueldoXiiiSueldoCalcular> = new Array();
  public listadoXiiiSueldo: Array<RhXiiiSueldo> = new Array();

  public listadoEmpleadosLote: Array<RhListaEmpleadoLoteTO> = new Array();
  public listadoRhRol: Array<RhRol> = new Array();
  public rhRol: RhRol = new RhRol();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();

  public listadoPrestamos: Array<RhPrestamo> = new Array();
  public rhPrestamo: RhPrestamo = new RhPrestamo();

  //adicionales para los componentes
  public formasDePagoBS: Array<RhComboFormaPagoBeneficioSocialTO> = new Array();
  public formasDePago: Array<RhComboFormaPagoTO> = new Array();
  public listadoConceptos: Array<RhListaBonoConceptoTO> = new Array();
  public listadoPiscinas: Array<PrdListaPiscinaTO> = new Array();
  public listaPrestamoMotivo: Array<RhPrestamoMotivo> = new Array();

  public conContable: ConContable = new ConContable();
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  public tituloForm: string = "";
  public salarioMinimo: number = 0;
  public vista: string = "";
  public constantes: any = LS;
  public es: object = {};
  public objetoAlDesmayorizar: any = {};
  public parametrosFormulario: any = {};
  //VALIDACIONES
  public esContable: boolean = true;
  public cargando: boolean = false;
  //
  public tipoSeleccionado: ConTipoTO = new ConTipoTO();

  constructor(
    private utilService: UtilService,
    private api: ApiRequestService,
    private toastr: ToastrService,
    private auth: AuthService,
    private archivoService: ArchivoService,
    private contableService: ContableListadoService,
    private contableFormularioService: ContableRrhhFormularioService
  ) {
  }

  ngOnInit() {
    this.constantes = LS;
    this.empresaSeleccionada = this.data.empresaSeleccionada;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    if (this.data) {
      this.operaciones();
    }
  }

  //OPERACIONES
  operaciones() {
    switch (this.data.accion) {
      case LS.ACCION_CONSULTAR: {
        this.tituloForm = LS.TITULO_FORM_CONSULTA_COMPROBANTE_CONTABLE;
        this.obtenerContableTO();
        break;
      }
      case LS.ACCION_MAYORIZAR: {
        if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_MAYORIZAR, this, true)) {
          this.tituloForm = LS.TITULO_FORM_MAYORIZAR_COMPROBANTE_CONTABLE;
          this.obtenerContableTO();
        }
        break;
      }
      case LS.ACCION_DESMAYORIZAR: {
        if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_DESMAYORIZAR, this, true)) {
          this.desmayorizarContable();
        }
        break;
      }
      case LS.ACCION_REVERSAR: {
        if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_REVERSAR, this, true)) {
          this.tituloForm = LS.TITULO_FORM_REVERSAR_COMPROBANTE_CONTABLE;
          this.obtenerContableTO();
        }
        break;
      }
      case LS.ACCION_ANULAR: {
        if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_ANULAR, this, true)) {
          this.tituloForm = LS.TITULO_FORM_ANULAR_COMPROBANTE_CONTABLE;
          this.obtenerContableTO();
        }
        break;
      }
      case LS.ACCION_ELIMINAR: {
        if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_ELIMINAR, this, true)) {
          this.tituloForm = LS.TITULO_FORM_ELIMINAR_COMPROBANTE_CONTABLE;
          this.obtenerContableTO();
        }
        break;
      }
      case LS.ACCION_RESTAURAR: {
        if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_RESTAURAR, this, true)) {
          this.restaurarContable();
        }
        break;
      }
      case LS.ACCION_DESBLOQUEAR: {
        if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_DESBLOQUEAR, this, true)) {
          this.desbloquerContable();
        }
        break;
      }
    }
  }

  /**Metodo para desmayorizar un contable, si tiene permiso de mayorizar, le mostrará una confirmación caso contrario solo mostrará un aviso que se desmayorizó */
  desmayorizarContable() {
    this.cargando = true;
    this.contableService.desmayorizarContable(this, this.obtenerconContablePK());
  }

  despuesDeDesmayorizarContable(respuesta) {
    this.cargando = false;
    this.toastr.success(respuesta.operacionMensaje, LS.TAG_AVISO);
    this.objetoAlDesmayorizar = respuesta.extraInfo;
    if (this.data.empresaSeleccionada.listaSisPermisoTO.gruMayorizarContables) {
      this.confirmacionMayorizar(respuesta.extraInfo);
    } else {
      this.data.volverACargar ? this.cerrarDefinitivo(false) : this.cerrarDefinitivo(respuesta.extraInfo);
    }
  }

  /**Metodo para restaurar un contable */
  restaurarContable() {
    this.cargando = true;
    this.contableService.restaurarContable(this, this.obtenerconContablePK());
  }

  despuesDeRestaurarContable(respuesta) {
    this.cargando = false;
    this.utilService.generarSwal(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
    this.data.volverACargar ? this.cerrarDefinitivo(false) : this.cerrarDefinitivo(respuesta.extraInfo);
  }

  /**Metodo para desbloquear un contable */
  desbloquerContable() {
    this.cargando = true;
    let enviarObjeto = { conContablePK: this.utilService.obtenerConContablePK(this.data.contable, LS.KEY_EMPRESA_SELECT, '|'), usuario: this.auth.getCodigoUser() };
    this.contableService.desbloquerContable(this, enviarObjeto);
  }

  despuesDeDesbloquerContable(respuesta) {
    this.cargando = false;
    this.utilService.generarSwal(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
    this.data.volverACargar ? this.cerrarDefinitivo(false) : this.cerrarDefinitivo(respuesta.extraInfo);
  }

  /**Mayorizar contable */
  mayorizarContable(parametro) {
    if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_MAYORIZAR, this, true)) {
      this.cargando = true;
      this.contableService.mayorizarContable(this, parametro);
    }
  }

  despuesDeMayorizarContable(respuesta) {
    this.cargando = false;
    this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
    this.data.volverACargar ? this.cerrarDefinitivo(true) : this.cerrarDefinitivo(respuesta.extraInfo);
  }

  /**Metodo para eliminar un contable */
  eliminar() {
    if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_ELIMINAR, this, true)) {
      let parametro = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametro).then(respuesta => {
        if (respuesta) {//Si presiona CONTABILIZAR
          let parametros = { conContablePK: this.utilService.obtenerConContablePK(this.data.contable, LS.KEY_EMPRESA_SELECT, '|') };
          this.cargando = true;
          this.contableService.eliminarConContable(this, parametros);
        } else {//Cierra el formulario
        }
      });
    }
  }

  despuesDeEliminarConContable(respuesta) {
    this.cargando = false;
    this.utilService.generarSwal(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
    this.data.volverACargar ? this.cerrarDefinitivo(false) : this.cerrarDefinitivo(this.conContable);
  }

  /**Metodo para anular o reversar un contable */
  guardarAnularReversar() {
    if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_ANULAR, this, true)) {
      let parametros = { conContablePK: this.utilService.obtenerConContablePK(this.data.contable, LS.KEY_EMPRESA_SELECT, '|'), anularReversar: this.data.accion === LS.ACCION_ANULAR ? true : false };
      this.anularReversarContable(parametros);
    }
  }

  /**Anular o reversar contable */
  anularReversarContable(parametros) {
    this.cargando = true;
    this.contableService.anularReversarContable(this, parametros);
  }

  despuesDeAnularReversarContable(respuesta) {
    this.cargando = false;
    this.utilService.generarSwal(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
    this.data.volverACargar ? this.cerrarDefinitivo(false) : this.cerrarDefinitivo(respuesta.extraInfo);
  }

  /**Nuevo contable */
  insertarContable(parametros) {
    this.contableService.insertarContable(this, parametros);
  }

  despuesDeInsertarContable(respuesta) {
    this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
    this.cerrarDefinitivo(respuesta.extraInfo);
  }

  /**Metodo para obtener el objeto ItemListaContableTO y así visualizar el contable*/
  obtenerContableTO() {
    this.cargando = true;
    this.api.post("todocompuWS/rrhhWebController/obtenerDatosParaMayorizarContableRRHH", this.obtenerconContablePK(), LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          this.conContable = respuesta.extraInfo.contable;
          this.conContable.conFecha = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.conContable.conFecha);
          this.periodoSeleccionado = new SisPeriodo(respuesta.extraInfo.periodo);
          this.tipoSeleccionado = respuesta.extraInfo.tipo;
          this.formatearDatosSegunVista(respuesta.extraInfo, respuesta.extraInfo.vista);
          this.vista = respuesta.extraInfo.vista;
          this.cargando = false;
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          this.cerrarDefinitivo(null);
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  fpPorPagar(): any {
    return {
      ctaCodigo: "000000000000",
      fpDetalle: "POR PAGAR",
      validar: false
    }
  }

  /*Formatear Datos segun vista poner*/
  formatearDatosSegunVista(data, vista) {
    switch (vista) {
      case "UTILIDAD":
        this.listadoRhUtilidades = data.utilidades;
        this.formasDePagoBS = data.formasDePagoBS;
        this.listadoUtilidades = this.contableFormularioService.conversionDeUtilidad(this.listadoRhUtilidades, this.formasDePagoBS);
        this.tituloForm = this.tituloForm + " " + this.tipoSeleccionado.tipDetalle + " No. " + this.conContable.conContablePK.conNumero;
        this.mostrarFormulario.emit(true);
        break;
      case "ANTICIPO":
        this.listadoRhAnticipo = data.anticipos;
        this.formasDePago = data.formasDePago;
        this.listadoAnticipos = this.contableFormularioService.conversionDeAnticipo(this.listadoRhAnticipo, this.formasDePago);
        this.tituloForm = this.tituloForm + " " + this.tipoSeleccionado.tipDetalle + " No. " + this.conContable.conContablePK.conNumero;
        this.mostrarFormulario.emit(true);
        break;
      case "ROL":
        this.listadoRhRol = data.roles;
        this.formasDePago = data.formasDePago;
        this.formasDePago.push(this.fpPorPagar());
        this.listadoEmpleadosLote = this.contableFormularioService.conversionDeRol(this.listadoRhRol, this.formasDePago);
        this.tituloForm = this.tituloForm + " " + this.tipoSeleccionado.tipDetalle + " No. " + this.conContable.conContablePK.conNumero;
        this.mostrarFormulario.emit(true);
        break;
      case "BONO":
        this.listadoRhBono = data.bonos;
        this.listadoConceptos = data.conceptos;
        this.listadoPiscinas = data.piscinas;
        this.listaResultadoBonos = this.contableFormularioService.conversionDeBono(this.listadoRhBono, this.listadoConceptos, this.listadoPiscinas);
        this.tituloForm = this.tituloForm + " " + this.tipoSeleccionado.tipDetalle + " No. " + this.conContable.conContablePK.conNumero;
        this.mostrarFormulario.emit(true);
        break;
      case "XIV":
        this.listadoXivSueldo = data.xivSueldos;
        this.formasDePagoBS = data.formasDePagoBS;
        this.listaResultadoXivSueldo = this.contableFormularioService.conversionXivSueldo(this.listadoXivSueldo, this.formasDePagoBS, data.salarioMinimo);
        this.tituloForm = this.tituloForm + " " + this.tipoSeleccionado.tipDetalle + " No. " + this.conContable.conContablePK.conNumero;
        this.salarioMinimo = data.salarioMinimo;
        this.mostrarFormulario.emit(true);
        break;
      case "XIII":
        this.listadoXiiiSueldo = data.xiiiSueldos;
        this.formasDePagoBS = data.formasDePagoBS;
        this.listaResultadoXiiiSueldo = this.contableFormularioService.conversionXiiiSueldo(this.listadoXiiiSueldo, this.formasDePagoBS);
        this.tituloForm = this.tituloForm + " " + this.tipoSeleccionado.tipDetalle + " No. " + this.conContable.conContablePK.conNumero;
        this.mostrarFormulario.emit(true);
        break;
      case "LIQUIDACION":
        this.listadoRhRol = data.roles;
        this.rhRol = this.listadoRhRol[0];
        this.formasDePago = data.formasDePago;
        this.listaEmpresas.push(this.empresaSeleccionada);
        this.tituloForm = this.tituloForm + " " + this.tipoSeleccionado.tipDetalle + " No. " + this.conContable.conContablePK.conNumero;
        this.mostrarFormulario.emit(true);
        break;
      case "PRESTAMO":
        this.listadoPrestamos = data.prestamos;
        this.rhPrestamo = this.listadoPrestamos[0];
        this.formasDePago = data.formasDePago;
        this.listaPrestamoMotivo = data.motivos;
        this.tituloForm = this.tituloForm + " " + this.tipoSeleccionado.tipDetalle + " No. " + this.conContable.conContablePK.conNumero
        this.mostrarFormulario.emit(true);
        break;
      default:
        this.cerrarDefinitivo(null);
        break;
    }
  }

  /**Metodo para imprimir el contable*/
  imprimirContable() {
    if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let itemContableTO: ListaConContableTO = new ListaConContableTO();
      let listadoConContable: Array<ListaConContableTO> = [];
      itemContableTO.empCodigo = this.data.empresaSeleccionada.empCodigo;
      itemContableTO.perCodigo = this.conContable.conContablePK.conPeriodo;
      itemContableTO.tipCodigo = this.conContable.conContablePK.conTipo;
      itemContableTO.conNumero = this.conContable.conContablePK.conNumero;
      itemContableTO.conFecha = this.utilService.convertirFechaStringDDMMYYYY(JSON.parse(JSON.stringify(this.conContable.conFecha)));
      itemContableTO.conPendiente = this.conContable.conPendiente ? LS.ETIQUETA_PENDIENTE : " ";
      itemContableTO.conAnulado = this.conContable.conAnulado ? LS.ETIQUETA_ANULADO : " ";
      itemContableTO.conReversado = this.conContable.conReversado ? LS.ETIQUETA_REVERSADO : " ";
      itemContableTO.conBloqueado = this.conContable.conBloqueado ? LS.ETIQUETA_BLOQUEADO : " ";
      itemContableTO.conConcepto = this.conContable.conConcepto;
      itemContableTO.conDetalle = this.conContable.conDetalle;
      itemContableTO.conObservaciones = this.conContable.conObservaciones;
      itemContableTO.conReferencia = this.conContable.conReferencia;
      delete itemContableTO.seleccionado;
      listadoConContable.push(itemContableTO);
      let parametros = { ListaConContableTO: listadoConContable };
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteContableDetalle", parametros, this.data.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoContables.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_SE_PUEDE_IMPRIMIR_POR_ESTADO, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //CONFIRMACIONES
  /**Metodo que se ejecuta al dar clic en boton cancelar, si se acepta la confirmación simplemente cerrará la vista de contable y no se realizara ningun cambio*/
  confirmacionCerrarContable() {
    this.cerrarDefinitivo(null);
  }

  /**Metodo que se ejecuta cuando se demayoriza un contable y tiene permiso de mayorizar, saldra una confirmacion de mayorizar */
  confirmacionMayorizar(contable) {
    swal(this.utilService.generarSwalConfirmationOption(LS.MSJ_TITULO_MAYORIZAR, LS.MSJ_PREGUNTA_MAYORIZAR, LS.SWAL_QUESTION))
      .then((result) => {
        if (result.value) {
          this.cargando = true;
          this.data.accion = LS.ACCION_MAYORIZAR;
          this.obtenerContableTO();
        }
        if (result.dismiss) {
          this.data.volverACargar ? this.cerrarDefinitivo(false) : this.cerrarDefinitivo(contable);
        }
      });
  }

  /**Metodo que se ejecuta para cerrar definitivamente la vista de contable */
  cerrarDefinitivo(contable) {
    this.tituloForm = null;
    this.cargando = false;
    this.cerrarContabilidadAcciones.emit({ mostrarContilidadAcciones: false, objetoEnviar: null, contable: contable });
    this.conContable = null;
    this.data = null;
  }

  /**Metodo para obtener el PK del contable */
  obtenerconContablePK(): object {
    return { conContablePK: this.utilService.obtenerConContablePK(this.data.contable, LS.KEY_EMPRESA_SELECT, '|') };
  }

  /**Metodo para obtener el mensaje personalizado de error */
  obtenerMensajeError(contable): string {
    let status = "." + LS.MSJ_ESTA;
    if (this.data.accion === LS.ACCION_MAYORIZAR) {
      status = contable.conPendiente ? "" : "." + LS.MSJ_NO_ESTA + LS.ETIQUETA_PENDIENTE;
    } else {
      status += contable.conPendiente ? LS.ETIQUETA_PENDIENTE : contable.conBloqueado ? LS.ETIQUETA_BLOQUEADO : contable.conReversado ? LS.ETIQUETA_BLOQUEADO : LS.ETIQUETA_REVERSADO;
    }
    return status;
  }

  /**Metodo para saber si se puede visualizar el contable, si es true, se visualiza caso contrario no se mostrará, para visualizar cuando se se quiere MAYORIZAR, debe estar pendiente. Para visualizar cuando (REVERSAR,ANULAR) no se debe estar anulado,bloqueado,pendiente o reversado */
  sePuedeVisualizarContable(contable): boolean {
    return this.data.accion === LS.ACCION_MAYORIZAR ? contable.conPendiente :
      (!contable.conAnulado && !contable.conBloqueado && !contable.conPendiente && !contable.conReversado);
  }

  /**Metodo para verificar si se guarda como pendiente al crear un nuevo contable o al mayorizar un contable */
  verificarGuardarComoPendiente(): boolean {
    let totalDebito = this.utilService.convertirDecimaleFloat(JSON.parse(JSON.stringify(0)));
    let totalCredito = this.utilService.convertirDecimaleFloat(JSON.parse(JSON.stringify(0)));
    let guardarComoPendiente = (totalDebito !== totalCredito);
    return guardarComoPendiente;
  }

  ejecutarAccion(event) {
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.activarEstado.emit(event.estado);
        break;
      case LS.ACCION_CANCELAR:
      case LS.ACCION_LIMPIAR_RESULTADO:
        this.activarEstado.emit(false);
        this.cerrarDefinitivo(this.conContable);
        break;
      case LS.ACCION_IMPRIMIR:
        this.imprimirContable();
        break;
      case LS.ACCION_ANULAR:
        this.guardarAnularReversar();
        break;
      case LS.ACCION_ELIMINAR:
        this.eliminar();
        break;
      case LS.ACCION_REVERSAR:
        this.guardarAnularReversar();
        break;
      case LS.ACCION_CARGANDO:
        this.cargando = event.estado;
        break;
    }
  }

}
