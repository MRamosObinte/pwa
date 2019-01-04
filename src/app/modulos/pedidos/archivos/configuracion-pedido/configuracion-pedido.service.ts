import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { InvPedidosConfiguracionTO } from '../../../../entidadesTO/inventario/InvPedidosConfiguracionTO';
import { LS } from '../../../../constantes/app-constants';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import * as moment from 'moment';
import { InvPedidosMotivo } from '../../../../entidades/inventario/InvPedidosMotivo';
import { InvPedidosMotivoTO } from '../../../../entidadesTO/inventario/InvPedidosMotivoTO';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionPedidoService {


  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private auth: AuthService
  ) {
    moment.locale('es');
  }

  /**
   *
   * Obtiene la lista de configuracion de pedido
   * @param {*} filtroConfiguracionMedidan
   * @param {*} contexto
   * @param {*} empresa
   * @memberof ConfiguracionPedidoService
   */
  getListaInvPedidosConfiguracion(filtroConfiguracionMedida, contexto, empresa) {
    this.api.post("todocompuWS/pedidosWebController/getListaInvPedidosConfiguracion", filtroConfiguracionMedida, empresa)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarConfiguracionPedido(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }


  esConfiguracionPedidoValida(configuracion: InvPedidosConfiguracionTO): boolean {
    if (configuracion.listAprobadores.length > 0 && configuracion.listEjecutores.length > 0 && configuracion.listRegistradores.length > 0) {
      return true;
    }
    return false;
  }

  generarColumnas(tipoUsuario, contexto): any {
    let columnas = [
      {
        headerName: LS.TAG_CODIGO,
        width: 110,
        minWidth: 110,
        valueGetter: (params) => {
          return params.data.usuario.usrCodigo;
        }
      },
      {
        headerName: LS.TAG_NOMBRE,
        width: 200,
        editable: true,
        minWidth: 200,
        valueGetter: (params) => {
          return params.data.usuario.usrNombre + " " + params.data.usuario.usrApellido;
        }
      }
    ];
    if (contexto.accion !== LS.ACCION_CONSULTAR) {
      columnas.push(
        this.utilService.getColumnaEliminar(tipoUsuario, contexto)
      )
    }
    return columnas;
  }

  /** ------------------------------ MOTIVO----------------------- */
  listarInvPedidosMotivo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/getListaInvPedidosMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarMotivos(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  listarInvPedidosMotivoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/getListaInvPedidosMotivoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvPedidosMotivoTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  /**
    * Retorna un objeto tipo InvPedidosMotivo
    * @param parametro de tipo {invPedidosMotivoPK: Obj-> InvPedidosMotivoPK}
    * @param contexto de tipo this
    */
  obtenerInvPedidosMotivo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/getInvPedidosMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerInvPedidosMotivo(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  convertirInvPedidosMotivoAInvPedidosMotivoTO(invPedidosMotivo: InvPedidosMotivo): InvPedidosMotivoTO {
    let invPedidosMotivoTO = new InvPedidosMotivoTO();
    invPedidosMotivoTO.pmEmpresa = invPedidosMotivo.invPedidosMotivoPK.pmEmpresa;
    invPedidosMotivoTO.pmCodigo = invPedidosMotivo.invPedidosMotivoPK.pmCodigo;
    invPedidosMotivoTO.pmSector = invPedidosMotivo.invPedidosMotivoPK.pmSector;
    invPedidosMotivoTO.pmDetalle = invPedidosMotivo.pmDetalle;
    invPedidosMotivoTO.pmHoraFin = invPedidosMotivo.pmHoraFin;
    invPedidosMotivoTO.pmHoraInicio = invPedidosMotivo.pmHoraInicio;
    invPedidosMotivoTO.pmInactivo = invPedidosMotivo.pmInactivo;
    return invPedidosMotivoTO;
  }

  /**
 * Completa los valores faltantes dependiendo de la accion a realizar
 * @param {*} invPedidosMotivo
 * @returns {InvPedidosMotivo}
 * @memberof MotivoPedidoService
 */
  formatearInvPedidosMotivo(invPedidosMotivo: InvPedidosMotivo, contexto): InvPedidosMotivo {
    let invPedidosMotivoCopia = new InvPedidosMotivo(invPedidosMotivo);
    invPedidosMotivoCopia.pmHoraInicio = invPedidosMotivo.pmHoraInicio.length > 5 ? invPedidosMotivo.pmHoraInicio : invPedidosMotivo.pmHoraInicio + ":0";
    invPedidosMotivoCopia.pmHoraFin = invPedidosMotivo.pmHoraFin.length > 5 ? invPedidosMotivo.pmHoraFin : invPedidosMotivo.pmHoraFin + ":0";
    if (contexto.accion === LS.ACCION_CREAR) {
      invPedidosMotivoCopia.invPedidosMotivoPK.pmEmpresa = contexto.empresaSeleccionada.empCodigo;
      invPedidosMotivoCopia.invPedidosMotivoPK.pmSector = contexto.sectorSeleccionado.secCodigo;
      invPedidosMotivoCopia.prdSector.prdSectorPK.secCodigo = contexto.sectorSeleccionado.secCodigo;
      invPedidosMotivoCopia.prdSector.prdSectorPK.secEmpresa = contexto.empresaSeleccionada.empCodigo;
      invPedidosMotivoCopia.usrCodigo = this.auth.getCodigoUser();
      invPedidosMotivoCopia.usrFechaInserta = null;
    }
    if (contexto.categoriaSeleccionada) {
      invPedidosMotivoCopia.invProductoCategoria.invProductoCategoriaPK.catEmpresa = contexto.empresaSeleccionada.empCodigo;
      invPedidosMotivoCopia.invProductoCategoria.invProductoCategoriaPK.catCodigo = contexto.categoriaSeleccionada.catCodigo;
    } else {
      invPedidosMotivoCopia.invProductoCategoria = null;
    }
    return invPedidosMotivoCopia;
  }

  /**
 * Validar que un dia este seleccionado
 * @param {*} invPedidosMotivo
 * @returns {boolean}
 * @memberof MotivoPedidoService
 */
  validarDiasSemana(invPedidosMotivo: InvPedidosMotivo): boolean {
    return invPedidosMotivo.pmLunes || invPedidosMotivo.pmMartes || invPedidosMotivo.pmMiercoles || invPedidosMotivo.pmJueves || invPedidosMotivo.pmViernes || invPedidosMotivo.pmSabado || invPedidosMotivo.pmDomingo
  }
  /**
   * Validara que la configuracion de usuarios tenga por lo menos un registro activo(registradores, aprobadores, ejecutores)
   *
   * @param {InvPedidosConfiguracionTO} configuracion
   * @param {boolean} pmAprobacionAutomatica //si es aporbacion automatica no validar aprobadores
   * @returns {boolean}
   * @memberof ConfiguracionPedidoService
   */
  validarUnoEnCadaTabla(configuracion: InvPedidosConfiguracionTO, pmAprobacionAutomatica: boolean): boolean {
    let rptaRegistradores = false;
    let rptaAprobadores = false;
    let rptaEjecutores = false;
    //registradores
    let registradores = configuracion.listRegistradores;
    if (registradores && registradores.length > 0) {
      for (let i = 0; i < registradores.length; i++) {
        if (registradores[i].activo) {
          rptaRegistradores = true;
          break;
        }
      }
    } else {
      return false;
    }
    //aprobadores
    if (!pmAprobacionAutomatica) {
      let aprobadores = configuracion.listAprobadores;
      if (aprobadores && aprobadores.length > 0) {
        for (let i = 0; i < aprobadores.length; i++) {
          if (aprobadores[i].activo) {
            rptaAprobadores = true;
            break;
          }
        }
      } else {
        return false;
      }
    } else {
      rptaAprobadores = true;
    }
    //ejecutores
    let ejecutores = configuracion.listEjecutores;
    if (ejecutores && ejecutores.length > 0) {
      for (let i = 0; i < ejecutores.length; i++) {
        if (ejecutores[i].activo) {
          rptaEjecutores = true;
          break;
        }
      }
    } else {
      return false;
    }
    return rptaRegistradores && rptaAprobadores && rptaEjecutores;
  }

  //[METODOS DEL MODULO DE PEDIDOS]
  /**
   * Retorna true si el periodo actual es válido para realizar un registro o aprobación de orden de pedido
   * Retorna false en caso de que la fecha no este dentro del rango establecido por el motivo
   * @param {*} fechaServidor : fecha actual del servidor en formato YYYY-MM-DD HH:mm:ss
   * @param {*} motivoSelect : Objeto tipo InvPedidoMotivo
   * @returns {boolean} 
   * @memberof UtilService
   */
  public esValidoPeriodoInvMotivo(fechaActual: Date, motivo: InvPedidosMotivo, showMensaje: boolean): boolean {
    if (!fechaActual) {
      this.toastr.warning(LS.MSJ_FECHA_NOVALIDA);
      return false;
    }
    let diaActual = this.utilService.getDayOfDate(fechaActual);
    let fechaInicio = new Date(new Date().toDateString() + ' ' + motivo.pmHoraInicio);
    let fechaFin = new Date(new Date().toDateString() + ' ' + motivo.pmHoraFin);
    var valido = false;
    if ((diaActual === 1 && motivo.pmLunes) || (diaActual === 2 && motivo.pmMartes) || (diaActual === 3 && motivo.pmMiercoles) || (diaActual === 4 && motivo.pmJueves) ||
      (diaActual === 5 && motivo.pmViernes) || (diaActual === 6 && motivo.pmSabado) || (diaActual === 0 && motivo.pmDomingo)) {
      if (fechaActual >= fechaInicio && fechaActual <= fechaFin) {
        valido = true;
      }
    }
    var horario: string = this.getHorarioInvPedidoMotivo(motivo);
    if (!valido) {
      let dias: string = this.obtenerDiasHabiles(motivo).join();
      let mensaje = LS.MSJ_PEDIDOS_HORARIO_REGISTRO + ' ' + dias + ". " + LS.TAG_HORARIO + ":" + horario;
      let parametros = {
        title: LS.TOAST_INFORMACION,
        texto: mensaje,
        type: LS.SWAL_INFO,
        confirmButtonText: "<i class='" + LS.ICON_AGREGAR + "'></i>  " + LS.LABEL_MAS_INFORMACION,
        cancelButtonText: LS.MSJ_ACEPTAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => { });
    }
    return valido;
  }

  /**
 * Retorna el horario dado un motivo de pedido
 * @param {*} fechaServidor
 * @param {*} motivoSelect
 * @returns {string}
 * @memberof MotivoPedidoService
 */
  public getHorarioInvPedidoMotivo(motivo): string {
    return motivo.pmHoraInicio.length > 4 && motivo.pmHoraFin.length > 4 ? motivo.pmHoraInicio.substring(0, 5) + ' - ' + motivo.pmHoraFin.substring(0, 5) : '';
  }


  /**
   * Retorna una lista de los días hábiles de un motivo de pedido
   * @param {*} motivoSelect :Objeto tipo InvPedidoMotivo
   * @returns {Array<string>}
   * @memberof UtilService
   */
  public obtenerDiasHabiles(motivoSelect: InvPedidosMotivo): Array<string> {
    var dias = [];
    if (motivoSelect.pmLunes) {
      dias.push(" " + LS.TAG_LUNES);
    }
    if (motivoSelect.pmMartes) {
      dias.push(" " + LS.TAG_MARTES);
    }
    if (motivoSelect.pmMiercoles) {
      dias.push(" " + LS.TAG_MIERCOLES);
    }
    if (motivoSelect.pmJueves) {
      dias.push(" " + LS.TAG_JUEVES);
    }
    if (motivoSelect.pmViernes) {
      dias.push(" " + LS.TAG_VIERNES);
    }
    if (motivoSelect.pmSabado) {
      dias.push(" " + LS.TAG_SABADO);
    }
    if (motivoSelect.pmDomingo) {
      dias.push(" " + LS.TAG_DOMINGO);
    }
    return dias;
  }

  generarColumnasMotivoPedido(): Array<any> {
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'pmCodigo',
        width: 200,
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'pmDetalle',
        width: 600,
      },
      {
        headerName: LS.TAG_HORA_INICIO,
        field: 'pmHoraInicio',
        width: 100,
        valueFormatter: this.formatearFecha
      },
      {
        headerName: LS.TAG_HORA_FIN,
        field: 'pmHoraFin',
        width: 100,
        valueFormatter: this.formatearFecha
      },
      {
        headerName: LS.TAG_INACTIVO,
        field: 'pmInactivo',
        width: 100,
        minWidth: 100,
        cellRenderer: 'inputEstado',
        cellClass: 'text-center'
      },
      this.utilService.getColumnaOpciones()
    ];
  }

  formatearFecha(params) {
    return params && params.value ? params.value.substring(0, 5) : '';
  }

  //Operaciones
  insertarInvPedidosConfiguracion(parametro, contexto, empresaSeleccionada) {
    this.api.post("todocompuWS/pedidosWebController/insertarInvPedidosConfiguracion", parametro, empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarInvPedidosConfiguracion(respuesta)
          contexto.cargando = false;
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  actualizarInvPedidosConfiguracion(parametro, contexto, empresaSeleccionada) {
    this.api.post("todocompuWS/pedidosWebController/modificarInvPedidosMotivo", parametro, empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeActualizarInvPedidosConfiguracion(respuesta)
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  actualizarEstadoInvPedidosConfiguracion(parametro, contexto, empresaSeleccionada) {
    this.api.post("todocompuWS/pedidosWebController/modificarEstadoInvPedidosMotivo", parametro, empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeActualizarEstadoInvPedidosConfiguracion(respuesta)
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  eliminarInvPedidosConfiguracion(parametros, contexto, empresaSeleccionada) {
    this.api.post("todocompuWS/pedidosWebController/eliminarInvPedidosMotivo", parametros, empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesEliminarInvPedidosConfiguracion(respuesta)
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  /**
   * Valida que los listados no esten llenos segun la accion
   * @param {*} accion
   * @param {*} listado
   * @returns {boolean}
   */
  validarListados(contexto): boolean {
    switch (contexto.accion) {
      case LS.ACCION_NUEVO:
      case LS.ACCION_CREAR:
        if (contexto.invPedidosConfiguracionTO && contexto.invPedidosConfiguracionTO.listRegistradores && contexto.invPedidosConfiguracionTO.listRegistradores.length > 0) {
          return false;
        }
        if (contexto.invPedidosConfiguracionTO && contexto.invPedidosConfiguracionTO.listAprobadores && contexto.invPedidosConfiguracionTO.listAprobadores.length > 0) {
          return false;
        }
        if (contexto.invPedidosConfiguracionTO && contexto.invPedidosConfiguracionTO.listEjecutores && contexto.invPedidosConfiguracionTO.listEjecutores.length > 0) {
          return false;
        }
        break;
      case LS.ACCION_EDITAR:
        break;
    }
    return true;
  }

}
