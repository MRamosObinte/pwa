import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { InvPedidos } from '../../../../entidades/inventario/InvPedidos';
import { InvPedidoTO } from '../../../../entidadesTO/inventario/InvPedidoTO';
import { InvPedidosDetalle } from '../../../../entidades/inventario/InvPedidosDetalle';
import { InvPedidosConfiguracionTO } from '../../../../entidadesTO/inventario/InvPedidosConfiguracionTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { InvPedidosPK } from '../../../../entidades/inventario/InvPedidosPK';
import { DecimalPipe } from '@angular/common';
import { InvPedidosMotivo } from '../../../../entidades/inventario/InvPedidosMotivo';
import { InputCellComponent } from '../../../componentes/input-cell/input-cell.component';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { PopOverInformacionComponent } from '../../../componentes/pop-over-informacion/pop-over-informacion.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { PinnedCellComponent } from '../../../componentes/pinned-cell/pinned-cell.component';

@Injectable({
  providedIn: 'root'
})
export class OrdenPedidoService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private auth: AuthService,//Se usa
  ) { }

  /**
   * Retorna el listado de ordenes de pedido
   * @param parametro debe ser tipo {empresa: {empCodigo}, busqueda:'', motivo:{pmMotico}, tipoOrden:null }
   */
  listarOrdenesPedido(parametro, contexto, empresaSelect) {
    contexto.filasTiempo && !contexto.isCombo ? contexto.filasTiempo.iniciarContador() : null;
    this.api.post("todocompuWS/pedidosWebController/getInvPedidos", parametro, empresaSelect)
      .then(respuesta => {
        contexto.filasTiempo && !contexto.isCombo ? contexto.filasTiempo.finalizarContador() : null;
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarOrdenPedido(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.actualizarFilas();
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listaInvPedidosOrdenTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/getListaInvPedidosOrdenTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarOrdenPedido(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.actualizarFilas();
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  /**
   * Retorna la orden de pedido
   * @param parametro debe ser tipo {empresa: {empCodigo}, motivo:{pmMotico}, numero:{number} }
   */
  obtenerOrdenPedido(parametro, contexto, empresaSelect) {
    contexto.filasTiempo ? contexto.filasTiempo.iniciarContador() : null;
    this.api.post("todocompuWS/pedidosWebController/obtenerInvPedidos", parametro, empresaSelect)
      .then(respuesta => {
        contexto.filasTiempo ? contexto.filasTiempo.finalizarContador() : null;
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerOrdenPedido(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  /**
* Consulta los datos necesarios para crear una orden de pedido
* @param {*} parametro : {invPedidosMotivoPK : new InvPedidosMotivoPK()}
* @param {*} contexto
* @param {*} empresaSelect
* @returns
* @memberof FormularioOrdenPedidoService
*/
  obtenerDatosParaGenerarOP(parametro, contexto, empresaSelect) {
    return this.api.post("todocompuWS/pedidosWebController/obtenerDatosParaGenerarOP", parametro, empresaSelect)
      .then(respuesta => {
        var data = null;
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO && respuesta.extraInfo) {
          if (respuesta.extraInfo.fechaActual && respuesta.extraInfo.invPedidosMotivo && respuesta.extraInfo.invPedidosConfiguracionTO) {
            data = respuesta.extraInfo;
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA_ACCION, LS.TAG_AVISO)
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
        contexto.cargando = false;
        return data;
      }).catch(err => this.utilService.handleError(err, contexto));
  }


  establecerFuncionesUsuario(configuracion: InvPedidosConfiguracionTO): Array<string> {
    let funcionesUsuario = [];
    funcionesUsuario = this.establecerFuncionesConfiguracionUsuario(configuracion.listRegistradores, 'Registrador', funcionesUsuario);
    funcionesUsuario = this.establecerFuncionesConfiguracionUsuario(configuracion.listAprobadores, 'Aprobador', funcionesUsuario);
    funcionesUsuario = this.establecerFuncionesConfiguracionUsuario(configuracion.listEjecutores, 'Ejecutor', funcionesUsuario);
    return funcionesUsuario;
  }

  private establecerFuncionesConfiguracionUsuario(listado: Array<any>, funcion: string, funcionesUsuario: Array<string>): Array<string> {
    var codCurrentUser = this.auth.getCodigoUser();
    for (let item of listado) {
      if (item.usuario.usrCodigo && item.usuario.usrCodigo === codCurrentUser) {
        if (funcion === 'Registrador') {
          funcionesUsuario.push('Registrador');
        } else if (funcion === 'Aprobador') {
          funcionesUsuario.push('Aprobador');
        } else if (funcion === 'Ejecutor') {
          funcionesUsuario.push('Ejecutor');
        }
      }
    }
    return funcionesUsuario;
  }

  /**
   * Verifica los permisos
   * @param {*} accion
   * @param {*} contexto
   * @param {*} [mostrarMensaje]
   * @returns {boolean}
   * @memberof OrdenPedidoService
   */
  verificarPermiso(accion, contexto, mostrarMensaje?): boolean {
    let permiso = false;
    switch (accion) {
      case LS.ACCION_CREAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruCrear && contexto.funcionesUsuario.indexOf('Registrador') > -1;
        break;
      }
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_MAYORIZAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruModificar && contexto.funcionesUsuario.indexOf('Registrador') > -1;
        break;
      }
      case LS.ACCION_DESMAYORIZAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruModificar && contexto.funcionesUsuario.indexOf('Registrador') > -1;
        break;
      }
      case LS.ACCION_ANULAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruEliminar && contexto.funcionesUsuario.indexOf('Registrador') > -1;
        break;
      }
      case LS.ACCION_RESTAURAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruEliminar && contexto.funcionesUsuario.indexOf('Registrador') > -1;
        break;
      }
      case LS.ACCION_APROBAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruModificar && contexto.funcionesUsuario.indexOf('Aprobador') > -1;
        break;
      }
      case LS.ACCION_DESAPROBAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruModificar && contexto.funcionesUsuario.indexOf('Aprobador') > -1;
        break;
      }
      case LS.ACCION_EJECUTAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruModificar && contexto.funcionesUsuario.indexOf('Ejecutor') > -1;
        break;
      }
      case LS.ACCION_ELIMINAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruEliminar && contexto.funcionesUsuario.indexOf('Registrador') > -1;
        break;
      }
      case LS.ACCION_IMPRIMIR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruImprimir;
        break;
      }
      case LS.ACCION_EXPORTAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruExportar;
        break;
      }
    }
    if (mostrarMensaje && !permiso) {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO)
    }
    return permiso;
  }

  getEstadoInvPedidos(invPedidos: InvPedidos): string {
    let estado = "";
    if (invPedidos.pedPendiente && !invPedidos.pedAprobado && !invPedidos.pedAnulado && !invPedidos.pedEjecutado) {
      return LS.ETIQUETA_PENDIENTE;
    }
    if (!invPedidos.pedPendiente && !invPedidos.pedAprobado && !invPedidos.pedAnulado && !invPedidos.pedEjecutado) {
      return LS.ETIQUETA_POR_APROBAR_PEDIDO;
    }
    if (!invPedidos.pedPendiente && invPedidos.pedAprobado && !invPedidos.pedAnulado && !invPedidos.pedEjecutado) {
      return LS.ETIQUETA_PEDIDO_APROBADO;
    }
    if (!invPedidos.pedPendiente && !invPedidos.pedAprobado && invPedidos.pedAnulado && !invPedidos.pedEjecutado) {
      return LS.ETIQUETA_ANULADO;
    }
    if (!invPedidos.pedPendiente && invPedidos.pedAprobado && !invPedidos.pedAnulado && invPedidos.pedEjecutado) {
      return LS.ETIQUETA_EJECUTADO;
    }
    return estado;
  }

  getEstadoInvPedidoTO(invPedidos: InvPedidoTO): string {
    let estado = "";
    if (invPedidos.pedpendiente && !invPedidos.pedaprobado && !invPedidos.pedanulado && !invPedidos.pedejecutado) {
      return LS.ETIQUETA_PENDIENTE;

    }
    if (!invPedidos.pedpendiente && !invPedidos.pedaprobado && !invPedidos.pedanulado && !invPedidos.pedejecutado) {
      return LS.ETIQUETA_POR_APROBAR_PEDIDO;

    }
    if (!invPedidos.pedpendiente && invPedidos.pedaprobado && !invPedidos.pedanulado && !invPedidos.pedejecutado) {
      return LS.ETIQUETA_PEDIDO_APROBADO;

    }
    if (!invPedidos.pedpendiente && !invPedidos.pedaprobado && invPedidos.pedanulado && !invPedidos.pedejecutado) {
      return LS.ETIQUETA_ANULADO;

    }
    if (!invPedidos.pedpendiente && invPedidos.pedaprobado && !invPedidos.pedanulado && invPedidos.pedejecutado) {
      return LS.ETIQUETA_EJECUTADO;

    }
    return estado;
  }

  establecerFormatoVistaIvPedidos(data: InvPedidos): InvPedidos {
    data.pedFechaEmision = typeof data.pedFechaEmision === "string" ? this.utilService.fomatearFechaString(data.pedFechaEmision, "YYYY-MM-DD") : new Date(data.pedFechaEmision);
    data.pedFechaHoraEntrega = typeof data.pedFechaHoraEntrega === "string" ? this.utilService.fomatearFechaString(data.pedFechaHoraEntrega, "YYYY-MM-DD") : new Date(data.pedFechaHoraEntrega);
    data.pedFechaVencimiento = typeof data.pedFechaVencimiento === "string" ? this.utilService.fomatearFechaString(data.pedFechaVencimiento, "YYYY-MM-DD") : new Date(data.pedFechaVencimiento);
    let invPedidosCopia: InvPedidos = data;
    invPedidosCopia.invPedidosDetalleList = this.obtenerFormatoVistaIvPedidosDetalle(invPedidosCopia.invPedidosDetalleList);
    invPedidosCopia.pedObservacionesRegistra = invPedidosCopia.pedObservacionesRegistra === " " ? "" : invPedidosCopia.pedObservacionesRegistra;
    invPedidosCopia.pedObservacionesAprueba = invPedidosCopia.pedObservacionesAprueba === " " ? "" : invPedidosCopia.pedObservacionesAprueba;
    invPedidosCopia.pedObservacionesEjecuta = invPedidosCopia.pedObservacionesEjecuta === " " ? "" : invPedidosCopia.pedObservacionesEjecuta;
    invPedidosCopia.pedOrdenCompra = invPedidosCopia.pedOrdenCompra === " " ? " " : invPedidosCopia.pedOrdenCompra;
    return invPedidosCopia;
  }

  obtenerFormatoVistaIvPedidosDetalle(listaInvPedidosDetalle: Array<InvPedidosDetalle>): Array<InvPedidosDetalle> {
    let listaPedidoDetalle: Array<InvPedidosDetalle> = [];
    listaInvPedidosDetalle.forEach(detalle => {
      let invPedidosDetalle = new InvPedidosDetalle(detalle);
      invPedidosDetalle.parcial = Number(invPedidosDetalle.detCantidadAdquirida) * Number(invPedidosDetalle.detPrecioReal);
      invPedidosDetalle.proCodigoPrincipal = detalle.invProducto.invProductoPK.proCodigoPrincipal;
      listaPedidoDetalle.push(invPedidosDetalle);
    });
    return listaPedidoDetalle;
  }

  establecerFormatoEnvioIvPedidos(invPedidos: InvPedidos, estado: string): InvPedidos {
    let invPedidosCopia: InvPedidos = new InvPedidos(invPedidos);
    let listaPedidoDetalle: Array<InvPedidosDetalle> = [];
    invPedidosCopia.invPedidosDetalleList.forEach(detalle => {
      let invPedidosDetalle = new InvPedidosDetalle(detalle);
      delete invPedidosDetalle.parcial;//TEMPORAL
      delete invPedidosDetalle.proCodigoPrincipal;//TEMPORAL
      delete invPedidosDetalle.categoriaProductoValido;//TEMPORAL

      if (estado === LS.ETIQUETA_PENDIENTE || estado === LS.ETIQUETA_POR_APROBAR_PEDIDO) {
        listaPedidoDetalle.push(invPedidosDetalle);
      }
      if (estado === LS.ETIQUETA_PEDIDO_APROBADO && invPedidosDetalle.detCantidadAprobada > 0) {
        listaPedidoDetalle.push(invPedidosDetalle);
      }
      if (estado === LS.ETIQUETA_EJECUTADO && invPedidosDetalle.detCantidadAdquirida > 0) {
        listaPedidoDetalle.push(invPedidosDetalle);
      }
    });
    invPedidosCopia.invPedidosDetalleList = listaPedidoDetalle;
    return invPedidosCopia;
  }

  formatearListadoIvPedidosTO(listadoInvPedidosTO: Array<InvPedidoTO>): Array<InvPedidoTO> {
    let listadoInvPedidosToCopia = Array();
    listadoInvPedidosTO.forEach(invPedidoTO => {
      if (invPedidoTO['seleccionado']) {
        listadoInvPedidosToCopia.push(new InvPedidoTO(invPedidoTO));
      }
    });
    return listadoInvPedidosToCopia;
  }

  formatearImprimirPedidosIndividual(listadoInvPedidosTO: Array<InvPedidoTO>): Array<InvPedidosPK> {
    let listaPk: Array<InvPedidosPK> = Array();
    listadoInvPedidosTO.forEach(invPedidoTO => {
      let invPedidosPK = new InvPedidosPK();
      invPedidosPK.pedEmpresa = invPedidoTO.codigoempresa;
      invPedidosPK.pedSector = invPedidoTO.codigosector;
      invPedidosPK.pedMotivo = invPedidoTO.codigomotivo;
      invPedidosPK.pedNumero = invPedidoTO.pedidonumero;
      listaPk.push(invPedidosPK);
    });
    return listaPk;
  }

  /**
   * Crea un nuevo objeto InvPedidoTO a partir de un InvPedidos
   * @param {*} data
   * @returns {InvPedidoTO}
   * @memberof FormularioOrdenPedidoService
   */
  crearInvPedidoTODeInvPedidos(data, configuracion: InvPedidosConfiguracionTO, motivoSeleccionado: InvPedidosMotivo): InvPedidoTO {
    let invPedidoTO: InvPedidoTO = new InvPedidoTO();
    invPedidoTO.pedidonumero = data.invPedidosPK.pedNumero;
    invPedidoTO.codigoempresa = data.invPedidosPK.pedEmpresa;
    invPedidoTO.codigomotivo = data.invPedidosPK.pedMotivo;
    invPedidoTO.codigosector = data.invPedidosPK.pedSector;
    invPedidoTO.detallemotivo = motivoSeleccionado.pmDetalle;
    invPedidoTO.pedfecha = data.pedFechaEmision ? data.pedFechaEmision : null;
    invPedidoTO.pedpendiente = data.pedPendiente;
    invPedidoTO.pedaprobado = data.pedAprobado;
    invPedidoTO.pedejecutado = data.pedEjecutado;
    invPedidoTO.pedanulado = data.pedAnulado;
    invPedidoTO.pedmontototal = data.pedMontoTotal;
    invPedidoTO.usrfechainserta = data.usrFechaInserta;
    invPedidoTO.obsregistra = data.pedObservacionesRegistra;
    invPedidoTO.obsaprueba = data.pedObservacionesAprueba;
    invPedidoTO.obsejecuta = data.pedObservacionesEjecuta;
    invPedidoTO.pedaprobado ? invPedidoTO.aprobador = this.obtenerUsuarioFuncion(data.usrAprueba, "Aprobador", configuracion) : null;
    invPedidoTO.pedejecutado ? invPedidoTO.ejecutor = this.obtenerUsuarioFuncion(data.usrEjecuta, "Ejecutor", configuracion) : null;
    invPedidoTO.registrador = this.obtenerUsuarioFuncion(data.usrRegistra, "Registrador", configuracion);
    invPedidoTO.estado = this.getEstadoInvPedidoTO(invPedidoTO);
    return invPedidoTO;
  }

  /**
 * Obtiene el apellido y nombre del registrador, aprobador, ejecutor para mostrar en la lista
 *
 * @param {*} usuCodigo
 * @param {*} funcion
 * @returns {String}
 * @memberof FormularioOrdenPedidoService
 */
  obtenerUsuarioFuncion(usuCodigo, funcion, configuracion): string {
    var usuario: string = "";
    switch (funcion) {
      case "Aprobador": {
        let aprobadores = configuracion.listAprobadores.filter(conf => conf.usuario.usrCodigo === usuCodigo);
        usuario = aprobadores.length > 0 ? aprobadores[0].usuario.usrNombre + " " + aprobadores[0].usuario.usrApellido : "S/D";
        break;
      }
      case "Ejecutor": {
        let ejecutores = configuracion.listEjecutores.filter(conf => conf.usuario.usrCodigo === usuCodigo);
        usuario = ejecutores.length > 0 ? ejecutores[0].usuario.usrNombre + " " + ejecutores[0].usuario.usrApellido : "S/D";
        break;
      }
      case "Registrador": {
        let registradores = configuracion.listRegistradores.filter(conf => conf.usuario.usrCodigo === usuCodigo);
        usuario = registradores.length > 0 ? registradores[0].usuario.usrNombre + " " + registradores[0].usuario.usrApellido : "S/D";
        break;
      }
    }
    return usuario;
  }

  obtenerAccionInvPedidos(accion): string {
    switch (accion) {
      case LS.ACCION_MAYORIZAR: {
        return "EDITAR";
      }
      case LS.ACCION_APROBAR: {
        return "APROBAR";
      }
      case LS.ACCION_DESAPROBAR: {
        return "DESAPROBAR";
      }
      case LS.ACCION_EJECUTAR: {
        return "EJECUTAR";
      }
    }
    return null;
  }

  obtenerUsuariosEmail(funcion: string, configuracion: InvPedidosConfiguracionTO): string {
    var email: string = "";
    switch (funcion) {
      case "Aprobador": {
        configuracion.listAprobadores.forEach(element => {
          if (element.usuario.usrEmailUsuario && element.usuario.usrEmailUsuario != "") {
            if (email === "") {
              email = element.usuario.usrEmailUsuario;
            } else {
              email = email + ";" + element.usuario.usrEmailUsuario;
            }
          }
        });
        break;
      }
      case "Ejecutor": {
        configuracion.listEjecutores.forEach(element => {
          if (element.usuario.usrEmailUsuario && element.usuario.usrEmailUsuario != "") {
            if (email === "") {
              email = element.usuario.usrEmailUsuario;
            } else {
              email = email + ";" + element.usuario.usrEmailUsuario;
            }
          }
        });
        break;
      }
      case "Registrador": {
        configuracion.listRegistradores.forEach(element => {
          if (element.usuario.usrEmailUsuario && element.usuario.usrEmailUsuario != "") {
            if (email === "") {
              email = element.usuario.usrEmailUsuario;
            } else {
              email = email + ";" + element.usuario.usrEmailUsuario;
            }
          }
        });
        break;
      }
    }
    return email;
  }

  /**
   * Completa y elimina los campos correspondientes antes de hacer una accion
   * @param {InvPedidos} ordenPedido
   * @param {*} [accionsub]
   * @returns {InvPedidos}
   * @memberof FormularioOrdenPedidoService 
   */
  formatearOrdenPedido(invPedidos: InvPedidos, isPendiente: boolean, contexto, accionsub?): InvPedidos {
    let ordenPedidoCopia = new InvPedidos(invPedidos);
    var codUsuarioActual = this.auth.getCodigoUser();
    ordenPedidoCopia.invPedidosDetalleList = this.formatearInvPedidosDetalle(ordenPedidoCopia.invPedidosDetalleList, accionsub, contexto.accion);
    switch (contexto.accion) {
      case LS.ACCION_CREAR:
        //Completar los campos faltantes
        ordenPedidoCopia.invPedidosPK = new InvPedidosPK();
        ordenPedidoCopia.invPedidosPK.pedEmpresa = contexto.motivoSeleccionado.invPedidosMotivoPK.pmEmpresa;
        ordenPedidoCopia.invPedidosPK.pedSector = contexto.motivoSeleccionado.invPedidosMotivoPK.pmSector;
        ordenPedidoCopia.invPedidosPK.pedMotivo = contexto.motivoSeleccionado.invPedidosMotivoPK.pmCodigo;
        ordenPedidoCopia.invPedidosPK.pedNumero = null;
        //
        ordenPedidoCopia.invPedidosMotivo = contexto.motivoSeleccionado;
        ordenPedidoCopia.pedPendiente = isPendiente ? true : false;
        ordenPedidoCopia.usrRegistra = codUsuarioActual;
        ordenPedidoCopia.usrAprueba = contexto.configuracion.listAprobadores[0].usuario.usrCodigo;
        ordenPedidoCopia.usrEjecuta = contexto.configuracion.listEjecutores[0].usuario.usrCodigo;
        if (accionsub === "registrar_aprobar") {
          ordenPedidoCopia.usrAprueba = codUsuarioActual;
          ordenPedidoCopia.pedAprobado = true;
          ordenPedidoCopia.pedPendiente = false;
          ordenPedidoCopia.pedObservacionesAprueba = ordenPedidoCopia.pedObservacionesRegistra;
          ordenPedidoCopia.pedOrdenCompra = ordenPedidoCopia.pedOrdenCompra
        }
        break;
      case LS.ACCION_MAYORIZAR:
        ordenPedidoCopia.pedPendiente = isPendiente ? true : false;
        if (accionsub === "registrar_aprobar") {
          ordenPedidoCopia.usrAprueba = codUsuarioActual;
          ordenPedidoCopia.pedAprobado = true;
          ordenPedidoCopia.pedPendiente = false;
          ordenPedidoCopia.pedObservacionesAprueba = ordenPedidoCopia.pedObservacionesRegistra;
          ordenPedidoCopia.pedOrdenCompra = ordenPedidoCopia.pedOrdenCompra
        }
        break;
      case LS.ACCION_APROBAR:
        ordenPedidoCopia.usrAprueba = codUsuarioActual;
        ordenPedidoCopia.pedAnulado = this.esAnuladoInvPedidos(ordenPedidoCopia.invPedidosDetalleList);
        ordenPedidoCopia.pedAprobado = !ordenPedidoCopia.pedAnulado; //Si es anulado entonces aprobado es false y viceversa
        ordenPedidoCopia.pedPendiente = false;
        break;
      case LS.ACCION_DESAPROBAR:
        ordenPedidoCopia.pedAnulado = false;
        ordenPedidoCopia.pedAprobado = false;
        ordenPedidoCopia.pedPendiente = false;
        break;
      case LS.ACCION_EJECUTAR:
        ordenPedidoCopia.usrEjecuta = codUsuarioActual;
        ordenPedidoCopia.pedEjecutado = true;
        break;
    }
    //Las observaciones son obligatorias
    ordenPedidoCopia.pedObservacionesRegistra = ordenPedidoCopia.pedObservacionesRegistra && ordenPedidoCopia.pedObservacionesRegistra.length > 0 ? ordenPedidoCopia.pedObservacionesRegistra : " ";
    ordenPedidoCopia.pedObservacionesAprueba = ordenPedidoCopia.pedObservacionesAprueba && ordenPedidoCopia.pedObservacionesAprueba.length > 0 ? ordenPedidoCopia.pedObservacionesAprueba : " ";
    ordenPedidoCopia.pedObservacionesEjecuta = ordenPedidoCopia.pedObservacionesEjecuta && ordenPedidoCopia.pedObservacionesEjecuta.length > 0 ? ordenPedidoCopia.pedObservacionesEjecuta : " ";
    ordenPedidoCopia.pedFechaEmision = ordenPedidoCopia.pedFechaEmision ? new Date(ordenPedidoCopia.pedFechaEmision).getTime() : null;
    ordenPedidoCopia.pedFechaHoraEntrega = ordenPedidoCopia.pedFechaHoraEntrega ? new Date(ordenPedidoCopia.pedFechaHoraEntrega).getTime() : null;
    ordenPedidoCopia.pedFechaVencimiento = ordenPedidoCopia.pedFechaVencimiento ? new Date(ordenPedidoCopia.pedFechaVencimiento).getTime() : null;
    ordenPedidoCopia.pedOrdenCompra = ordenPedidoCopia.pedOrdenCompra ? ordenPedidoCopia.pedOrdenCompra : "";
    return ordenPedidoCopia;
  }

  /** Agrega o quita campos del detalle de pedido */
  formatearInvPedidosDetalle(invPedidosDetalleList: Array<InvPedidosDetalle>, accionsub: string, accion): Array<InvPedidosDetalle> {
    let listaResultado: Array<InvPedidosDetalle> = [];
    let i = 0;
    for (let invPedidosDetalle of invPedidosDetalleList) {
      let detalle = new InvPedidosDetalle(invPedidosDetalle);
      detalle.detOrden = i;
      delete detalle.proCodigoPrincipal;//Quita el campo temporal
      delete detalle.parcial;//Quita el campo temporal
      delete detalle.categoriaProductoValido;//TEMPORAL

      detalle.detCantidadSolicitada = this.utilService.convertirStringNumber(detalle.detCantidadSolicitada);
      detalle.detCantidadAprobada = this.utilService.convertirStringNumber(detalle.detCantidadAprobada);
      detalle.detCantidadAdquirida = this.utilService.convertirStringNumber(detalle.detCantidadAdquirida);
      //Las observaciones son obligatorias
      detalle.detObservacionesRegistra = detalle.detObservacionesRegistra && detalle.detObservacionesRegistra.length > 0 ? detalle.detObservacionesRegistra : " ";
      detalle.detObservacionesAprueba = detalle.detObservacionesAprueba && detalle.detObservacionesAprueba.length > 0 ? detalle.detObservacionesAprueba : " ";
      detalle.detObservacionesEjecuta = detalle.detObservacionesEjecuta && detalle.detObservacionesEjecuta.length > 0 ? detalle.detObservacionesEjecuta : " ";
      if (accion === LS.ACCION_CREAR) {
        detalle.detSecuencial = null;
      }
      if (accion === LS.ACCION_MAYORIZAR || accion === LS.ACCION_CREAR) {
        detalle.detCantidadAprobada = detalle.detCantidadSolicitada;
        if (accionsub === "registrar_aprobar") {
          detalle.detObservacionesAprueba = detalle.detObservacionesRegistra;
        }
      }
      if (accion === LS.ACCION_EJECUTAR) {
        if (detalle.detCantidadAdquirida === 0) {
          detalle.detPrecioReal = 0.00;
        }
      }
      listaResultado.push(detalle);
      i++;
    }
    return listaResultado;
  }

  /**
   * Si las cantidades aprobadas son mayores a cero no se anula
   * caso contrario la orden es anulada
   * @param {Array<InvPedidosDetalle>} invPedidosDetalleList
   * @returns
   * @memberof FormularioOrdenPedidoService
   */
  esAnuladoInvPedidos(invPedidosDetalleList: Array<InvPedidosDetalle>) {
    for (let invPedidosDetalle of invPedidosDetalleList) {
      if (invPedidosDetalle.detCantidadAprobada > 0) {
        return false;
      }
    }
    return true;
  }

  puedeImprimirInvPedidos(invPedidosDetalleList: Array<InvPedidosDetalle>): boolean {
    for (let invPedidosDetalle of invPedidosDetalleList) {
      if (invPedidosDetalle.detCantidadAdquirida > 0) {
        return true;
      }
    }
    return false;
  }

  formatearA2Decimales(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }

  estaAprobadoTodo(invPedidos: InvPedidos): boolean {
    for (let invPedidosDetalle of invPedidos.invPedidosDetalleList) {
      if (invPedidosDetalle.detCantidadAprobada === 0) {
        return false;
      }
    }
    return true;
  }

  obtenerReceptoresInvPedidos(estado, contexto): string {
    let receptores: string = "";
    switch (estado) {
      case "PENDIENTE": {//Al estar pendiente los receptores de la orden de pedido son los aprobadores
        for (let aprobador of contexto.configuracion.listAprobadores) {
          receptores = receptores === "" ? receptores + aprobador.usuario.usrNombre + " " + aprobador.usuario.usrApellido : receptores + ", " + aprobador.usuario.usrNombre + " " + aprobador.usuario.usrApellido;
        }
        break;
      }
      case "PEDIDO APROBADO": {//Al estar aprobado los receptores de la orden de pedido son los ejecutores
        for (let ejecutor of contexto.configuracion.listEjecutores) {
          receptores = receptores === "" ? receptores + ejecutor.usuario.usrNombre + " " + ejecutor.usuario.usrApellido : receptores + ", " + ejecutor.usuario.usrNombre + " " + ejecutor.usuario.usrApellido;
        }
        break;
      }
      case "HISTORIAL": {//Al consultar se muestra el hostorial
        break;
      }
      default:
        break;
    }
    return receptores;
  }

  obtenerNombreReporte(estado): string {
    let nombreReporte: string = "";
    switch (estado) {
      case "PENDIENTE": {
        return "reportOrdenPedidoPendiente.jrxml";
      }
      case "PEDIDO APROBADO": {
        return "reportOrdenPedidoAprobado.jrxml";
      }
      case "EJECUTADO": {
        return "reportOrdenPedidoEjecutado.jrxml";
      }
      case "HISTORIAL": {//Al consultar se muestra el hostorial
        return "reportOrdenPedidoHistorial.jrxml";
      }
      default: {
        break;
      }
    }
    return nombreReporte;
  }

  obtenerCampoDesdeReferencia(campoReferencia: string): string {
    let campo: string = null;
    switch (campoReferencia) {
      case "ecosto01": {
        return "proCostoReferencial1"
      }
      case "ecosto02": {
        return "proCostoReferencial2"
      }
      case "ecosto03": {
        return "proCostoReferencial3"
      }
    }
    return campo;
  }

  obtenerListaDetalleOrdenCompra(invPedidosDetalleList: Array<InvPedidosDetalle>, accion: string): Array<InvPedidosDetalle> {
    let listaDetalle: Array<InvPedidosDetalle> = []
    if (accion === LS.ACCION_EJECUTAR) {
      invPedidosDetalleList.forEach(item => {
        if (item.detCantidadAdquirida > 0 && item.detPrecioReal > 0) {
          listaDetalle.push(item);
        }
      })
    } else {
      listaDetalle = invPedidosDetalleList.slice();
    }
    return listaDetalle;
  }

  puedoCancelarFormularioDetalle(datosIniciales, datosFinales): boolean {
    if (datosIniciales && datosFinales) {
      let vi = JSON.stringify(datosIniciales);
      let vf = JSON.stringify(datosFinales);
      if (vi !== vf) {
        return false;
      }
    }
    return true;
  }

  validarCantidadSolicitada(data): boolean {
    let cantidadSolicitada = data.detCantidadSolicitada;
    let minimo = 0.01;
    return cantidadSolicitada && cantidadSolicitada >= minimo;
  }

  validarCantidadAprobar(data): boolean {
    let detCantidadSolicitada = data.detCantidadSolicitada;
    let detCantidadAprobada = data.detCantidadAprobada;
    return detCantidadAprobada <= detCantidadSolicitada;
  }

  validarProducto(data): boolean {
    return data.invProducto && data.invProducto.invProductoPK.proCodigoPrincipal ? true : false;
  }

  validarCategoriaProducto(data, motivo): boolean {
    if (!motivo.invProductoCategoria.catDetalle || motivo.invProductoCategoria.catDetalle.trim().length == 0) {
      return true;
    } else {
      return data.invProducto.invProductoCategoria && data.invProducto.invProductoCategoria.catDetalle === motivo.invProductoCategoria.catDetalle ? true : false;
    }
  }

  crearInvPedidoDetalle(): InvPedidosDetalle {
    let invPedidosDetalle = new InvPedidosDetalle({ detOrden: 0, detCantidadSolicitada: 1.00 });
    return invPedidosDetalle;
  }

  /**Generar columnas cuando se quiere aprobar una orden de pedido*/
  generarColumnasOrdenPedidoDetalleAprobar(contexto): Array<any> {
    let editable = contexto.accion !== LS.ACCION_CONSULTAR && contexto.accion !== LS.ACCION_ANULAR && contexto.accion !== LS.ACCION_DESAPROBAR;
    let isAprobadorRegistrador = contexto.motivoSeleccionado.pmAprobacionAutomatica &&
      contexto.usrRegistradorNombre.trim() === contexto.usrAprobadorNombre.trim() &&
      contexto.invPedidos.pedObservacionesRegistra === contexto.invPedidos.pedObservacionesAprueba;

    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_CODIGO,
        field: 'proCodigoPrincipal',
        width: 200,
        minWidth: 200,
        cellClass: 'cell-block',
        valueGetter: (params) => { return params.data.invProducto.invProductoPK.proCodigoPrincipal; }
      },
      {
        headerName: LS.TAG_DESCRIPCION,
        field: 'proNombre',
        width: 200,
        minWidth: 200,
        cellClass: 'cell-block',
        valueGetter: (params) => { return params.data.invProducto.proNombre; }
      },
      {
        headerName: LS.TAG_KARDEX,
        headerClass: 'cell-header-center',//Clase a nivel de th
        width: 50,
        minWidth: 50,
        cellClass: 'text-center cell-block',
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: LS.ICON_KARDEX,
          tooltip: LS.TAG_KARDEX,
          text: '',
          enableSorting: false
        },
        cellRendererFramework: BotonAccionComponent,
        cellRendererParams: {
          icono: LS.ICON_KARDEX,
          tooltip: LS.TAG_KARDEX,
          accion: 'verKardex',
          class: ''
        }
      },
      {
        headerName: LS.TAG_UNIDAD_MEDIDA,
        field: 'medDetalle',
        cellClass: 'cell-block',
        width: 150,
        minWidth: 150,
        valueGetter: (params) => { return params.data.invProducto.invProductoMedida.medDetalle; },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_UNIDAD_MEDIDA,
          text: LS.TAG_UN_MEDIDA,
          enableSorting: true
        }
      },
      {
        headerName: LS.TAG_CANT_SOLICITADA,
        field: 'detCantidadSolicitada',
        valueFormatter: this.formatearA2Decimales,
        width: 150,
        minWidth: 150,
        cellClass: 'text-right cell-block',
        cellEditorFramework: NumericCellComponent,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_CANTIDAD_SOLICITADA,
          text: LS.TAG_CANT_SOLICITADA,
          enableSorting: true
        }
      },
    )

    if (editable) {
      columnas.push(
        {
          headerComponent: 'inputLabelCell',
          headerClass: 'pr-0',
          headerComponentParams: { name: LS.TAG_CANT_APROBADA, tooltipName: LS.TAG_CANTIDAD_APROBADA, value: contexto.cantidadAprobadaCheck, tooltipText: 'Aprobar todos' },
          field: 'detCantidadAprobada',
          valueFormatter: this.formatearA2Decimales,
          width: 150,
          minWidth: 150,
          suppressKeyboardEvent: (params) => {
            if (params.event.keyCode === LS.KEYCODE_RIGHT || params.event.keyCode === LS.KEYCODE_LEFT) {
              if (params.editing) { return true; }
            }
          },
          editable: true,
          cellClass: 'text-right',
          cellClassRules: { "cell-with-errors": (params) => { return !this.validarCantidadAprobar(params.data); } },
          cellEditorFramework: NumericCellComponent,
          cellEditorParams: {
            name: 'detCantidadAprobada',
            maxlength: 25,
            placeholder: '0.00',
            configAutonumeric: contexto.configAutonumeric
          }
        }
      )
    } else {
      columnas.push(
        {
          headerName: LS.TAG_CANT_APROBADA,
          field: 'detCantidadAprobada',
          valueFormatter: this.formatearA2Decimales,
          width: 150,
          minWidth: 150,
          cellClass: 'text-right cell-block',
          cellEditorFramework: NumericCellComponent,
          valueGetter: (params) => { return (contexto.invPedidos.pedAprobado ? params.data.detCantidadAprobada : 0) },
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: '',
            tooltip: LS.TAG_CANTIDAD_APROBADA,
            text: LS.TAG_CANT_APROBADA,
            enableSorting: true
          }
        },
      )
    }

    if (editable) {
      columnas.push(
        {
          headerName: LS.TAG_OBSERVACIONES,
          field: 'detObservacionesAprueba',
          width: 300,
          minWidth: 120,
          suppressKeyboardEvent: (params) => {
            if (params.event.keyCode === LS.KEYCODE_RIGHT || params.event.keyCode === LS.KEYCODE_LEFT) {
              if (params.editing) { return true; }
            }
          },
          editable: editable,
          cellEditorFramework: InputCellComponent,
          cellEditorParams: {
            name: 'detObservacionesAprueba',
            maxlength: 1000,
            inputClass: 'text-uppercase',
            placeholder: ''
          }
        }
      )
    } else {
      columnas.push(
        {
          headerName: LS.TAG_OBSERVACIONES,
          field: 'detObservacionesAprueba',
          width: 300,
          minWidth: 120
        }
      )
    }
    columnas.push(
      {
        headerName: LS.TAG_OBS_REGISTRADOR,
        field: '',
        width: 120,
        minWidth: 120,
        cellRendererFramework: PopOverInformacionComponent,
        cellRendererParams: (params) => {
          return {
            titulo: LS.TAG_OBS_REGISTRADOR,
            informacion: params.data.detObservacionesRegistra
          };
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_OBSERVACION_REGISTRADOR,
          text: LS.TAG_OBS_REGISTRADOR,
          enableSorting: true
        },
        hide: isAprobadorRegistrador
      }
    )

    return columnas;
  }

  generarColumnasOrdenPedidoAprobar(apAutomatica): Array<any> {
    let opciones: any = {
      headerName: LS.TAG_OPCIONES,
      headerClass: 'cell-header-center',//Clase a nivel de th
      cellClass: 'text-center',
      cellClassRules: {
        'fila-pendiente': (params) => {
          return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false)
        }
      },
      width: LS.WIDTH_OPCIONES,
      minWidth: LS.WIDTH_OPCIONES,
      cellRendererFramework: BotonOpcionesComponent,
      headerComponentFramework: TooltipReaderComponent,
      headerComponentParams: {
        class: LS.ICON_OPCIONES,
        tooltip: LS.TAG_OPCIONES,
        text: '',
        enableSorting: false
      }
    };
    let columnas = [
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 40,
        minWidth: 40,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_ESTADO,
        headerClass: 'text-center',
        field: 'estado',
        width: 90,
        minWidth: 90,
        cellClass: 'text-center',
        cellRenderer: 'iconoEstado',
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'pedidonumero',
        width: 90,
        minWidth: 90,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'pedfecha',
        width: 100,
        minWidth: 100,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_REGISTRADOR,
        field: 'registrador',
        width: 200,
        minWidth: 200,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
      }
    ];
    if (!apAutomatica) {
      columnas.push(
        {
          headerName: LS.TAG_APROBADOR,
          field: 'aprobador',
          width: 200,
          minWidth: 200,
          cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
        }
      )
    };
    columnas.push(opciones);
    return columnas;
  }

  /**Generar columnas cuando se quiere crear una orden de pedido */
  generarColumnasOrdenPedidoDetalle(contexto, accion): Array<any> {
    let esEditable = accion === LS.ACCION_CREAR || accion === LS.ACCION_MAYORIZAR ? true : false;
    let consultando = accion === LS.ACCION_CONSULTAR || accion === LS.ACCION_ELIMINAR || accion === LS.ACCION_ANULAR;
    let columnas: Array<any> = [];
    /**EDITANDO O CREANDO */
    if (esEditable) {
      columnas.push(
        {
          headerName: LS.TAG_MOVER_FILA,
          field: '',
          headerClass: 'cell-header-center',
          cellClass: 'text-center cell-block',
          width: 40,
          minWidth: 40,
          rowDrag: esEditable, //Para mover las filas
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: LS.ICON_MOVER_FILA,
            tooltip: LS.TAG_MOVER_FILA,
            text: '',
            enableSorting: false
          },
          valueGetter: ''
        },
        {
          headerName: LS.TAG_CODIGO,
          field: 'proCodigoPrincipal',
          width: 120,
          minWidth: 120,
          cellClassRules: { "cell-with-errors": (params) => { return (!this.validarProducto(params.data) || !params.data.categoriaProductoValido) } },
          suppressKeyboardEvent: (params) => {
            if (params.event.keyCode !== LS.KEYCODE_UP && params.event.keyCode !== LS.KEYCODE_DOWN) {
              contexto.buscarProducto(params);
              if (params.editing) { return true; }
            } else {
              if (params.editing) { return this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoResultado) }
            }
          },
          editable: true,
          valueGetter: (params) => { return params.data.invProducto.invProductoPK.proCodigoPrincipal; },
          cellEditorFramework: InputCellComponent,
          cellEditorParams: {
            name: 'proCodigoPrincipal',
            maxlength: 50,
            inputClass: 'text-uppercase',
            placeholder: ''
          }
        },
        {
          headerName: LS.TAG_DESCRIPCION,
          field: 'proNombre',
          width: 200,
          minWidth: 200,
          cellClass: 'cell-block',
          valueGetter: (params) => { return params.data.invProducto.proNombre; }
        },
        {
          headerName: LS.TAG_KARDEX,
          headerClass: 'cell-header-center',//Clase a nivel de th
          cellClass: 'text-center cell-block',
          width: 50,
          minWidth: 50,
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: LS.ICON_KARDEX,
            tooltip: LS.TAG_KARDEX,
            text: '',
            enableSorting: false
          },
          cellRendererFramework: BotonAccionComponent,
          cellRendererParams: {
            icono: LS.ICON_KARDEX,
            tooltip: LS.TAG_KARDEX,
            accion: 'verKardex',
            class: ''
          }
        },
        {
          headerName: LS.TAG_UNIDAD_MEDIDA,
          field: 'medDetalle',
          width: 150,
          minWidth: 150,
          cellClass: 'cell-block',
          valueGetter: (params) => { return params.data.invProducto.invProductoMedida.medDetalle; },
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: '',
            tooltip: LS.TAG_UNIDAD_MEDIDA,
            text: LS.TAG_UN_MEDIDA,
            enableSorting: true
          }
        },
        {
          headerName: LS.TAG_CANTIDAD,
          field: 'detCantidadSolicitada',
          valueFormatter: this.formatearA2Decimales,
          width: 120,
          minWidth: 120,
          suppressKeyboardEvent: (params) => {
            if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoResultado) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
          },
          editable: true,
          cellClass: 'text-right',
          cellClassRules: { "cell-with-errors": (params) => { return !this.validarCantidadSolicitada(params.data) } },
          cellEditorFramework: NumericCellComponent,
          cellEditorParams: {
            name: 'detCantidadSolicitada',
            maxlength: 25,
            placeholder: '0.00',
            configAutonumeric: contexto.configAutonumeric
          }
        },
        {
          headerName: LS.TAG_OBSERVACIONES,
          field: 'detObservacionesRegistra',
          width: 300,
          minWidth: 120,
          cellClass: 'text-uppercase',
          suppressKeyboardEvent: (params) => {
            contexto.agregarFilaAlFinal(params);
            if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoResultado) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
          },
          editable: true,
          cellEditorFramework: InputCellComponent,
          cellEditorParams: {
            name: 'detObservacionesRegistra',
            maxlength: 1000,
            inputClass: 'text-uppercase',
            placeholder: ''
          }
        },
        {
          headerName: LS.TAG_OPCIONES,
          headerClass: 'cell-header-center',//Clase a nivel de th
          cellClass: 'text-center cell-block',
          width: LS.WIDTH_OPCIONES,
          minWidth: LS.WIDTH_OPCIONES,
          cellRendererFramework: BotonOpcionesComponent,
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: LS.ICON_OPCIONES,
            tooltip: LS.TAG_OPCIONES,
            text: '',
            enableSorting: false
          }
        }
      );
    }
    /*CONSULTANDO */
    if (consultando) {
      columnas.push(
        {
          headerName: LS.TAG_CODIGO,
          field: 'proCodigoPrincipal',
          width: 200,
          minWidth: 200,
          valueGetter: (params) => { return params.data.invProducto.invProductoPK.proCodigoPrincipal; }
        },
        {
          headerName: LS.TAG_KARDEX,
          headerClass: 'cell-header-center',//Clase a nivel de th
          cellClass: 'text-center cell-block',
          width: 70,
          minWidth: 70,
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: LS.ICON_KARDEX,
            tooltip: LS.TAG_KARDEX,
            text: '',
            enableSorting: false
          },
          cellRendererFramework: BotonAccionComponent,
          cellRendererParams: {
            icono: LS.ICON_KARDEX,
            tooltip: LS.TAG_KARDEX,
            accion: 'verKardex',
            class: ''
          }
        },
        {
          headerName: LS.TAG_DESCRIPCION,
          field: 'proNombre',
          width: 200,
          minWidth: 200,
          valueGetter: (params) => { return params.data.invProducto.proNombre; }
        },
        {
          headerName: LS.TAG_UNIDAD_MEDIDA,
          field: 'medDetalle',
          width: 150,
          minWidth: 150,
          valueGetter: (params) => { return params.data.invProducto.invProductoMedida.medDetalle; },
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: '',
            tooltip: LS.TAG_UNIDAD_MEDIDA,
            text: LS.TAG_UN_MEDIDA,
            enableSorting: true
          }
        },
        {
          headerName: LS.TAG_CANT_SOLICITADA,
          field: 'detCantidadSolicitada',
          valueFormatter: this.formatearA2Decimales,
          width: 120,
          minWidth: 120,
          cellClass: 'text-right',
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: '',
            tooltip: LS.TAG_CANTIDAD_SOLICITADA,
            text: LS.TAG_CANT_SOLICITADA,
            enableSorting: true
          }
        }
      );
      if (contexto.paraOrdenCompra) {
        columnas.push(
          {
            headerName: LS.TAG_CANT_APROBADA,
            field: 'detCantidadAprobada',
            valueFormatter: this.formatearA2Decimales,
            width: 120,
            minWidth: 120,
            cellClass: 'text-right',
            headerComponentFramework: TooltipReaderComponent,
            headerComponentParams: {
              class: '',
              tooltip: LS.TAG_CANTIDAD_APROBADA,
              text: LS.TAG_CANT_APROBADA,
              enableSorting: true
            }
          },
          {
            headerName: LS.TAG_VER_ORDEN_COMPRA,
            headerClass: 'cell-header-center',//Clase a nivel de th
            cellClass: 'text-center',
            width: 70,
            minWidth: 70,
            pinnedRowCellRenderer: PinnedCellComponent,
            headerComponentFramework: TooltipReaderComponent,
            headerComponentParams: {
              class: LS.ICON_ORDENCOMPRA,
              tooltip: LS.TAG_VER_ORDEN_COMPRA,
              text: '',
              enableSorting: false
            },
            cellRendererFramework: BotonAccionComponent,
            cellRendererParams: (params) => {
              return {
                icono: LS.ICON_ORDENCOMPRA,
                tooltip: LS.TAG_VER_ORDEN_COMPRA,
                accion: 'consultarOrdenesCompra',
                class: ''
              }
            }
          },
          {
            headerName: LS.TAG_OBS_REGISTRADOR,
            field: '',
            width: 120,
            minWidth: 120,
            cellRendererFramework: PopOverInformacionComponent,
            cellRendererParams: (params) => {
              return {
                titulo: LS.TAG_OBS_REGISTRADOR,
                informacion: params.data.detObservacionesRegistra
              };
            },
            headerComponentFramework: TooltipReaderComponent,
            headerComponentParams: {
              class: '',
              tooltip: LS.TAG_OBSERVACION_REGISTRADOR,
              text: LS.TAG_OBS_REGISTRADOR,
              enableSorting: true
            }
          }
        );
        if (contexto.motivoSeleccionado.pmAprobacionAutomatica != true) {
          columnas.push(
            {
              headerName: LS.TAG_OBS_APROBADOR,
              field: '',
              width: 120,
              minWidth: 120,
              cellRendererFramework: PopOverInformacionComponent,
              cellRendererParams: (params) => {
                return {
                  titulo: LS.TAG_OBS_APROBADOR,
                  informacion: params.data.detObservacionesAprueba
                };
              },
              headerComponentFramework: TooltipReaderComponent,
              headerComponentParams: {
                class: '',
                tooltip: LS.TAG_OBSERVACION_APROBADOR,
                text: LS.TAG_OBS_APROBADOR,
                enableSorting: true
              }
            }
          )
        }
      } else {
        columnas.push(
          {
            headerName: LS.TAG_OBS_REGISTRADOR,
            field: '',
            width: 120,
            minWidth: 120,
            cellRendererFramework: PopOverInformacionComponent,
            cellRendererParams: (params) => {
              return {
                titulo: LS.TAG_OBS_REGISTRADOR,
                informacion: params.data.detObservacionesRegistra
              };
            },
            headerComponentFramework: TooltipReaderComponent,
            headerComponentParams: {
              class: '',
              tooltip: LS.TAG_OBSERVACION_REGISTRADOR,
              text: LS.TAG_OBS_REGISTRADOR,
              enableSorting: true
            }
          }
        );
      }
    }
    return columnas;
  }

  generarColumnasOrdenPedido(contexto): Array<any> {
    let columnas: Array<any> = [];

    columnas.push(
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: contexto.parametrosBusqueda.visualizarConsultaOrdenPedido ? 80 : 20,
        minWidth: contexto.parametrosBusqueda.visualizarConsultaOrdenPedido ? 80 : 20,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_ESTADO,
        headerClass: 'text-center',
        field: 'estado',
        width: contexto.parametrosBusqueda.visualizarConsultaOrdenPedido ? 100 : 40,
        minWidth: contexto.parametrosBusqueda.visualizarConsultaOrdenPedido ? 100 : 40,
        cellClass: 'text-center',
        cellRenderer: 'iconoEstado',
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'pedidonumero',
        width: contexto.parametrosBusqueda.visualizarConsultaOrdenPedido ? 100 : 50,
        minWidth: contexto.parametrosBusqueda.visualizarConsultaOrdenPedido ? 100 : 50,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'pedfecha',
        width: contexto.parametrosBusqueda.visualizarConsultaOrdenPedido ? 100 : 50,
        minWidth: contexto.parametrosBusqueda.visualizarConsultaOrdenPedido ? 100 : 50,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_REGISTRADOR,
        field: 'registrador',
        width: 120,
        minWidth: 120,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
      }
    );

    if (contexto.parametrosBusqueda.visualizarConsultaOrdenPedido) {
      columnas.push(
        {
          headerName: LS.TAG_APROBADOR,
          field: 'aprobador',
          width: 200,
          minWidth: 200,
          cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
        },
        {
          headerName: LS.TAG_EJECUTOR,
          field: 'ejecutor',
          width: 200,
          minWidth: 200,
          cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
        }
      )
    }

    columnas.push(
      {
        headerName: contexto.parametrosBusqueda.visualizarConsultaOrdenPedido ? LS.TAG_OBS_REGISTRADOR : LS.TAG_OBSERVACIONES,
        field: 'obsregistra',
        width: 200,
        minWidth: 200,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
      }
    )

    if (contexto.parametrosBusqueda.visualizarConsultaOrdenPedido) {
      columnas.push(
        {
          headerName: LS.TAG_OBS_APROBADOR,
          field: 'obsaprueba',
          width: 200,
          minWidth: 200,
          cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
        },
        {
          headerName: LS.TAG_OBS_EJECUTOR,
          field: 'obsejecuta',
          width: 200,
          minWidth: 200,
          cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } }
        }
      )
    }

    columnas.push(
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        cellClass: 'text-center',
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.estado === LS.ETIQUETA_PENDIENTE ? true : false) } },
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRendererFramework: BotonOpcionesComponent,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: '',
          enableSorting: false
        },
      }
    )

    return columnas;
  }

  //Operaciones
  insertarOrdenPedido(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/insertarInvPedidos", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarOrdenPedido(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  actualizarOrdenPedido(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/modificarInvPedidos", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeActualizarOrdenPedido(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  anularOrdenPedido(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/anularInvPedidos", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeAnularOrdenPedido(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  eliminarOrdenPedido(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/eliminarInvPedidos", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeEliminarOrdenPedido(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  desaprobarOrdenPedido(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/desaprobarInvPedidos", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeDesaprobarOrdenPedido(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }
}
