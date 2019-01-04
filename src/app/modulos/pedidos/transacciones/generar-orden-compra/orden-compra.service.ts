import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { InvPedidosOrdenCompra } from '../../../../entidades/inventario/InvPedidosOrdenCompra';
import { InvPedidosOrdenCompraTO } from '../../../../entidadesTO/inventario/InvPedidosOrdenCompraTO';
import { LS } from '../../../../constantes/app-constants';
import { InvPedidosOrdenCompraDetalle } from '../../../../entidades/inventario/InvPedidosOrdenCompraDetalle';
import { InvPedidosOrdenCompraDetalleTO } from '../../../../entidadesTO/inventario/InvPedidosOrdenCompraDetalleTO';
import { InvPedidosDetalle } from '../../../../entidades/inventario/InvPedidosDetalle';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { InvPedidosOrdenCompraPK } from '../../../../entidades/inventario/InvPedidosOrdenCompraPK';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';

@Injectable({
  providedIn: 'root'
})
export class OrdenCompraService {
  constructor(
    private utilService: UtilService,
    private authService: AuthService,
    public api: ApiRequestService,
    public toastr: ToastrService,
    public archivoService: ArchivoService
  ) { }

  obtenerOrdenCompra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/obtenerOrdenCompra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerOrdenCompra(respuesta.extraInfo);
        } else {
          contexto.despuesDeObtenerOrdenCompra(null);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  listarOrdenesCompra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/getListaInvPedidosOrdenCompraTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarOrdenesCompra(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  /**
   * Envia la notificacion al proveedor, es obligatorio que el contexto tenga el objeto empresaSeleccionada
   * @param {*} parametro
   * @param {*} contexto
   * @param {*} empresa
   * @memberof AppSistemaService
   */
  enviarNotificacionProveedor(parametro, contexto, empresa) {
    let codigoEmpresa = "";
    this.archivoService.completarInformacionReporte(parametro, contexto.empresaSeleccionada, codigoEmpresa);
    this.api.post("todocompuWS/pedidosWebController/enviarPDFOrdenCompra", parametro, empresa)
      .then(data => {
        contexto.despuesDeEnviarNotificacion(data);
        contexto.cargando = false;
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerDatosGenerarInvPedidosOrdenCompra(parametro, contexto, empresa) {
    return this.api.post("todocompuWS/pedidosWebController/getDatosGenerarInvPedidosOrdenCompra", parametro, empresa)
      .then(respuesta => {
        var data = null;
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO && respuesta.extraInfo) {
          if (respuesta.extraInfo.listaInvPedidosDetalle) {
            data = respuesta.extraInfo;
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA_ACCION, LS.TAG_AVISO)
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
        return data;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerDatosInvPedidosOrdenCompra(parametro, contexto, empresa) {
    return this.api.post("todocompuWS/pedidosWebController/obtenerInvPedidosOrdenCompra", parametro, empresa)
      .then(respuesta => {
        var data = null;
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO && respuesta.extraInfo) {
          if (respuesta.extraInfo.invPedidosOrdenCompra) {
            data = respuesta.extraInfo;
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA_ACCION, LS.TAG_AVISO)
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
        data === null ? contexto.cargando = false : null;
        return data;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerListaOrdenCompraSeleccionadoIndividual(listadoInvPedidosOrdenCompraTO: Array<InvPedidosOrdenCompraTO>): Array<InvPedidosOrdenCompraPK> {
    let listadoCopia: Array<InvPedidosOrdenCompraPK> = Array();
    listadoInvPedidosOrdenCompraTO.forEach(invPedidosOrdenCompraTO => {
      listadoCopia.push(new InvPedidosOrdenCompraPK(invPedidosOrdenCompraTO));
    });
    return listadoCopia;
  }

  generarColumnasOrdenCompra(ocmAprobacionAutomatica): Array<any> {
    let columnas: Array<any> = [
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 40,
        minWidth: 40
      },
      {
        headerName: LS.TAG_ESTADO,
        headerClass: 'text-center',
        width: 100,
        minWidth: 90,
        cellClass: 'text-center',
        cellRendererFramework: IconoEstadoComponent,
        valueGetter: (params) => {
          if (params.data.ocAnulado) {
            params.value = LS.ETIQUETA_ANULADO;
            return params.value;
          }
          if (params.data.ocAprobada) {
            params.value = LS.ETIQUETA_OC_APROBADO;
            return params.value;
          } else if (!params.data.ocAprobada) {
            params.value = LS.ETIQUETA_POR_APROBAR_OC;
            return params.value;
          }
          return '';
        }
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'ocNumero',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'ocFecha',
        width: 100,
        minWidth: 100
      }
    ];
    if (!ocmAprobacionAutomatica) {
      columnas.push(
        {
          headerName: LS.TAG_APROBADOR,
          field: 'usrAprueba',
          width: 250,
          minWidth: 250
        }
      )
    };
    columnas.push(
      {
        headerName: LS.TAG_PROVEEDOR,
        field: 'provRazonSocial',
        width: 430,
        minWidth: 400
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'ocMontoTotal',
        width: 200,
        minWidth: 200,
        cellClass: 'text-right',
        valueFormatter: this.utilService.formatearA2Decimales
      },
      this.utilService.getColumnaOpciones()
    );
    return columnas;
  }

  formatearOrdenCompra(invPedidosOrdenCompra: InvPedidosOrdenCompra, contexto): InvPedidosOrdenCompra {
    let ordenCompraCopia = new InvPedidosOrdenCompra(invPedidosOrdenCompra);
    switch (contexto.accion) {
      case LS.ACCION_EJECUTAR:
        ordenCompraCopia.invPedidosOrdenCompraPK.ocEmpresa = contexto.empresaSeleccionada.empCodigo;
        ordenCompraCopia.invPedidosOrdenCompraPK.ocNumero = null;
        ordenCompraCopia.invPedidosOrdenCompraPK.ocSector = contexto.data.invPedidosPK.pedSector;
        ordenCompraCopia.invPedidosOrdenCompraPK.ocMotivo = contexto.motivoOCSeleccionado.ocmCodigo;
        ordenCompraCopia.ocAnulado = false;
        ordenCompraCopia.ocValorRetencion = this.utilService.quitarComasNumero(contexto.invPedidosOrdenCompra.ocValorRetencion);
        ordenCompraCopia.usrCodigo = this.authService.getCodigoUser();
        ordenCompraCopia.invPedidosOrdenCompraMotivo.invPedidosOrdenCompraMotivoPK.ocmEmpresa = contexto.motivoOCSeleccionado.ocmEmpresa;
        ordenCompraCopia.invPedidosOrdenCompraMotivo.invPedidosOrdenCompraMotivoPK.ocmSector = contexto.motivoOCSeleccionado.ocmSector;
        ordenCompraCopia.invPedidosOrdenCompraMotivo.invPedidosOrdenCompraMotivoPK.ocmCodigo = contexto.motivoOCSeleccionado.ocmCodigo;
        break;
    }
    ordenCompraCopia.ocFechaEmision = ordenCompraCopia.ocFechaEmision ? new Date(ordenCompraCopia.ocFechaEmision).getTime() : null;
    ordenCompraCopia.ocFechaHoraEntrega = ordenCompraCopia.ocFechaHoraEntrega ? new Date(ordenCompraCopia.ocFechaHoraEntrega).getTime() : null;
    return ordenCompraCopia;
  }

  crearInvOrdenCompraTO(invPedidosOrdenCompra: InvPedidosOrdenCompra): InvPedidosOrdenCompraTO {
    let ordenCompraTO = new InvPedidosOrdenCompraTO();
    ordenCompraTO.index = Math.round(20);
    ordenCompraTO.ocEmpresa = invPedidosOrdenCompra.invPedidosOrdenCompraPK.ocEmpresa;
    ordenCompraTO.ocSector = invPedidosOrdenCompra.invPedidosOrdenCompraPK.ocSector;
    ordenCompraTO.ocMotivo = invPedidosOrdenCompra.invPedidosOrdenCompraPK.ocMotivo;
    ordenCompraTO.ocNumero = invPedidosOrdenCompra.invPedidosOrdenCompraPK.ocNumero;
    ordenCompraTO.ocFecha = invPedidosOrdenCompra.ocFechaEmision;
    ordenCompraTO.ocAnulado = invPedidosOrdenCompra.ocAnulado;
    ordenCompraTO.ocAprobada = invPedidosOrdenCompra.ocAprobada;
    ordenCompraTO.ocMontoTotal = invPedidosOrdenCompra.ocMontoTotal;
    ordenCompraTO.usrAprueba = invPedidosOrdenCompra.usrAprueba;
    ordenCompraTO.provRazonSocial = invPedidosOrdenCompra.invProveedor.provRazonSocial;
    ordenCompraTO.provCodigo = invPedidosOrdenCompra.invProveedor.invProveedorPK.provCodigo;
    ordenCompraTO.ocmDetalle = invPedidosOrdenCompra.invPedidosOrdenCompraMotivo.ocmDetalle;
    ordenCompraTO.provEmailOrdenCompra = invPedidosOrdenCompra.invProveedor.provEmailOrdenCompra;
    ordenCompraTO.ocmNotificarProveedor = invPedidosOrdenCompra.invPedidosOrdenCompraMotivo.ocmNotificarProveedor;
    return ordenCompraTO;
  }

  obtenerFormatoGenerarOrdenCompraDetalleList(listaInvPedidosDetalle: Array<InvPedidosDetalle>, aprobarTodos: boolean): Array<InvPedidosOrdenCompraDetalleTO> {
    let listaPedidosOrdenCompraDetalle: Array<InvPedidosOrdenCompraDetalleTO> = [];
    listaInvPedidosDetalle.forEach((detalle, index) => {
      let detalleCompra: InvPedidosOrdenCompraDetalleTO = new InvPedidosOrdenCompraDetalleTO();
      detalleCompra.detSecuencialOrdenCompra = null;
      detalleCompra.detOrden = index;
      detalleCompra.detSecuencial = detalle.detSecuencial;
      detalleCompra.detCantidadAprobada = detalle.detCantidadAprobada;
      detalleCompra.detCantidadAdquirida = detalle.detCantidadAdquirida;
      detalleCompra.detCompletado = detalle.detCompletado;
      detalleCompra.proEmpresa = detalle.invProducto.invProductoPK.proEmpresa;
      detalleCompra.proCodigoPrincipal = detalle.invProducto.invProductoPK.proCodigoPrincipal;
      detalleCompra.proNombre = detalle.invProducto.proNombre;
      detalleCompra.proCostoReferencial1 = detalle.invProducto.proCostoReferencial1;
      detalleCompra.proCostoReferencial2 = detalle.invProducto.proCostoReferencial2;
      detalleCompra.proCostoReferencial3 = detalle.invProducto.proCostoReferencial3;
      detalleCompra.medEmpresa = detalle.invProducto.invProductoMedida.invProductoMedidaPK.medEmpresa;
      detalleCompra.medCodigo = detalle.invProducto.invProductoMedida.invProductoMedidaPK.medCodigo;
      detalleCompra.medDetalle = detalle.invProducto.invProductoMedida.medDetalle;
      detalleCompra.ocObsRegistra = detalle.detObservacionesRegistra;
      detalleCompra.ocObsAprueba = detalle.detObservacionesAprueba;
      detalleCompra.ocObsEjecuta = detalle.detObservacionesEjecuta;
      if (aprobarTodos) {
        detalleCompra.detCantidad = detalle.detCantidadAprobada - detalle.detCantidadAdquirida;
      }
      listaPedidosOrdenCompraDetalle.push(detalleCompra);
    });
    return listaPedidosOrdenCompraDetalle;
  }

  obtenerFormatoConsultaOrdenCompraDetalleList(listaInvPedidosOrdenCompraDetalle: Array<InvPedidosOrdenCompraDetalle>): Array<InvPedidosOrdenCompraDetalleTO> {
    let listaPedidosOrdenCompraDetalle: Array<InvPedidosOrdenCompraDetalleTO> = [];
    listaInvPedidosOrdenCompraDetalle.forEach(detalle => {
      let detalleCompra: InvPedidosOrdenCompraDetalleTO = new InvPedidosOrdenCompraDetalleTO();
      detalleCompra.detSecuencialOrdenCompra = detalle.detSecuencialOrdenCompra;
      detalleCompra.detCantidad = detalle.detCantidad;
      detalleCompra.detPrecioReferencial = detalle.detPrecioReferencial;
      detalleCompra.detPrecioReal = detalle.detPrecioReal;
      detalleCompra.detObservaciones = detalle.detObservaciones;
      detalleCompra.detOrden = detalle.invPedidosDetalle.detOrden;
      detalleCompra.detSecuencial = detalle.invPedidosDetalle.detSecuencial;
      detalleCompra.detCantidadAprobada = detalle.invPedidosDetalle.detCantidadAprobada;
      detalleCompra.detCantidadAdquirida = detalle.invPedidosDetalle.detCantidadAdquirida;
      detalleCompra.detCompletado = detalle.invPedidosDetalle.detCompletado;
      detalleCompra.proEmpresa = detalle.invPedidosDetalle.invProducto.invProductoPK.proEmpresa;
      detalleCompra.proCodigoPrincipal = detalle.invPedidosDetalle.invProducto.invProductoPK.proCodigoPrincipal;
      detalleCompra.proNombre = detalle.invPedidosDetalle.invProducto.proNombre;
      detalleCompra.proCostoReferencial1 = detalle.invPedidosDetalle.invProducto.proCostoReferencial1;
      detalleCompra.proCostoReferencial2 = detalle.invPedidosDetalle.invProducto.proCostoReferencial2;
      detalleCompra.proCostoReferencial3 = detalle.invPedidosDetalle.invProducto.proCostoReferencial3;
      detalleCompra.medEmpresa = detalle.invPedidosDetalle.invProducto.invProductoMedida.invProductoMedidaPK.medEmpresa;
      detalleCompra.medCodigo = detalle.invPedidosDetalle.invProducto.invProductoMedida.invProductoMedidaPK.medCodigo;
      detalleCompra.medDetalle = detalle.invPedidosDetalle.invProducto.invProductoMedida.medDetalle;
      detalleCompra.ocEmpresa = detalle.invPedidosOrdenCompra.invPedidosOrdenCompraPK.ocEmpresa;
      detalleCompra.ocSector = detalle.invPedidosOrdenCompra.invPedidosOrdenCompraPK.ocSector;
      detalleCompra.ocMotivo = detalle.invPedidosOrdenCompra.invPedidosOrdenCompraPK.ocMotivo;
      detalleCompra.ocNumero = detalle.invPedidosOrdenCompra.invPedidosOrdenCompraPK.ocNumero;
      listaPedidosOrdenCompraDetalle.push(detalleCompra);
    });
    return listaPedidosOrdenCompraDetalle;
  }

  crearListaDetalleOrdenCompra(listaInvPedidosOrdenCompraDetalleTO: Array<InvPedidosOrdenCompraDetalleTO>): Array<InvPedidosOrdenCompraDetalle> {
    let listaDetalle: Array<InvPedidosOrdenCompraDetalle> = []
    listaInvPedidosOrdenCompraDetalleTO.forEach((item, index) => {
      let ordenCompraDetalle = new InvPedidosOrdenCompraDetalle();
      ordenCompraDetalle.detSecuencialOrdenCompra = null;
      ordenCompraDetalle.detOrden = index;
      ordenCompraDetalle.detCantidad = item.detCantidad;
      ordenCompraDetalle.detPrecioReferencial = item.detPrecioReferencial;
      ordenCompraDetalle.detPrecioReal = item.detPrecioReal;
      ordenCompraDetalle.detObservaciones = item.detObservaciones && item.detObservaciones.trim().length > 0 ? item.detObservaciones : ' ';
      ordenCompraDetalle.invPedidosDetalle = new InvPedidosDetalle({ detSecuencial: item.detSecuencial, detCompletado: item.detCompletado });
      delete ordenCompraDetalle.invPedidosDetalle.parcial;//quita temporal
      delete ordenCompraDetalle.invPedidosDetalle.proCodigoPrincipal;//quita temporal
      delete ordenCompraDetalle.invPedidosDetalle.categoriaProductoValido;//quita temporal

      ordenCompraDetalle.invPedidosOrdenCompra = null;
      listaDetalle.push(ordenCompraDetalle);
    });
    return listaDetalle;
  }

  obtenerTotalDeListaInvPedidosOrdenCompraDetalle(listaInvPedidosOrdenCompraDetalle: Array<InvPedidosOrdenCompraDetalle>): number {
    var total = 0;
    listaInvPedidosOrdenCompraDetalle.forEach((item) => {
      total = total + item.detCantidad * item.detPrecioReal;
    });
    return this.utilService.redondearNDecimales(total, 2);
  }

  establecerCantidadAdquiridaEnInvPedidosDetalle(listaInvPedidosOrdenCompraDetalle: Array<InvPedidosOrdenCompraDetalle>, listaInvPedidosDetalle: Array<InvPedidosDetalle>): Array<InvPedidosDetalle> {
    let listaDetalle: Array<InvPedidosDetalle> = [];
    listaInvPedidosDetalle.forEach((item) => {
      let objeto = this.obtenerObjetoEnListaInvPedidosDetalle(listaInvPedidosOrdenCompraDetalle, item.detSecuencial);
      if ((objeto.cantidad > 0 && objeto.detPrecioReal > 0) || objeto.detCompletado) {
        item.detCantidadAdquirida = item.detCantidadAdquirida + objeto.cantidad;
        item.detCompletado = objeto.detCompletado;
        listaDetalle.push(item);
      }
    });
    return listaDetalle;
  }

  obtenerObjetoEnListaInvPedidosDetalle(listaInvPedidosOrdenCompraDetalle: Array<InvPedidosOrdenCompraDetalle>, secuenciaDetallePedido: number): any {
    var objeto = {};
    for (let detalle of listaInvPedidosOrdenCompraDetalle) {
      if (detalle.invPedidosDetalle.detSecuencial === secuenciaDetallePedido) {
        objeto = { cantidad: detalle.detCantidad, detCompletado: detalle.invPedidosDetalle.detCompletado, detPrecioReal: detalle.detPrecioReal };
        return objeto;
      }
    }
    return objeto;
  }

  obtenerCampoCostoDesdeEtiqueta(campoReferencia: string): string {
    let campo: string = null;
    switch (campoReferencia) {
      case "proCostoReferencial1": {
        return "ecosto01"
      }
      case "proCostoReferencial2": {
        return "ecosto02"
      }
      case "proCostoReferencial3": {
        return "ecosto03"
      }
      case "proCostoReferencial4": {
        return "ecosto04"
      }
      case "proCostoReferencial5": {
        return "ecosto05"
      }
    }
    return campo;
  }

  mostrarSwalMasInformacion(mensaje, contexto) {
    let parametros = {
      title: LS.TOAST_INFORMACION,
      texto: mensaje,
      type: LS.SWAL_INFO,
      confirmButtonText: "<i class='" + LS.ICON_AGREGAR + "'></i>  " + LS.LABEL_MAS_INFORMACION,
      cancelButtonText: LS.MSJ_ACEPTAR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {
        window.open(LS.ENLACE_MANUAL_USUARIO, '_blank');
      }
      contexto.cerrarFormulario();
    });
  }

}


