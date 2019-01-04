import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { LS } from '../../../../constantes/app-constants';
import { InvPedidosOrdenCompraMotivo } from '../../../../entidades/inventario/InvPedidosOrdenCompraMotivo';
import { InvPedidosOrdenCompraMotivoTO } from '../../../../entidadesTO/inventario/InvPedidosOrdenCompraMotivoTO';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionOrdenCompraService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private authService: AuthService,
    private atajoService: HotkeysService,
    private archivoService: ArchivoService
  ) { }

  listarInvPedidosOrdenCompraMotivoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/getListaInvPedidosOrdenCompraMotivoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvPedidosOrdenCompraMotivoTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerInvPedidosOrdenCompraMotivo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/getInvPedidosOrdenCompraMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerInvPedidosOrdenCompraMotivo(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  eliminarInvPedidosOrdenCompraMotivo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/eliminarInvPedidosOrdenCompraMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
          contexto.refrescarTabla(contexto.objetoSeleccionado, 'D');
        } else {
          this.toastr.warning(respuesta.operacionMensaje);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  guardarInvPedidosOrdenCompraMotivo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/insertarConfiguracionOrdenCompra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.resetearFormulario();
          let motivoTO = this.convertirInvPedidosOrdenCompraMotivoTO(respuesta.extraInfo);
          contexto.refrescarTabla(motivoTO, 'I');
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
        } else {
          this.toastr.warning(respuesta.operacionMensaje);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  actualizarInvPedidosOrdenCompraMotivo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/pedidosWebController/modificarConfiguracionOrdenCompra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.resetearFormulario();
          let motivoTO = this.convertirInvPedidosOrdenCompraMotivoTO(respuesta.extraInfo);
          contexto.refrescarTabla(motivoTO, 'U');
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
        } else {
          this.toastr.warning(respuesta.operacionMensaje);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  actualizarEstadoInvPedidosOrdenCompraMotivo(parametro, contexto, empresaSeleccionada) {
    this.api.post("todocompuWS/pedidosWebController/modificarEstadoInvPedidosOrdenCompraMotivo", parametro, empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeActualizarEstadoInvPedidosOrdenCompraMotivo(respuesta)
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  imprimirInvPedidosOrdenCompraMotivo(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/pedidosWebController/generarReporteInvPedidosOrdenCompraMotivo", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listaMotivoOrdenCompra' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarInvPedidosOrdenCompraMotivo(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/pedidosWebController/exportarReporteInvPedidosOrdenCompraMotivo", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, 'listaMotivoOrdenCompra_');
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  formatearInvPedidosOrdenCompraMotivo(invPedidosOrdenCompraMotivo: InvPedidosOrdenCompraMotivo, contexto): InvPedidosOrdenCompraMotivo {
    let motivoCopia = new InvPedidosOrdenCompraMotivo(invPedidosOrdenCompraMotivo);
    if (contexto.accion === LS.ACCION_CREAR) {
      motivoCopia.invPedidosOrdenCompraMotivoPK.ocmEmpresa = contexto.empresaSeleccionada.empCodigo;
      motivoCopia.invPedidosOrdenCompraMotivoPK.ocmSector = contexto.sectorSeleccionado.secCodigo;
      motivoCopia.usrCodigo = this.authService.getCodigoUser();
    }
    return motivoCopia;
  }

  convertirInvPedidosOrdenCompraMotivoTO(invPedidosOrdenCompraMotivo: InvPedidosOrdenCompraMotivo): InvPedidosOrdenCompraMotivoTO {
    let motivoTOCopia = new InvPedidosOrdenCompraMotivoTO();
    motivoTOCopia.ocmCodigo = invPedidosOrdenCompraMotivo.invPedidosOrdenCompraMotivoPK.ocmCodigo;
    motivoTOCopia.ocmDetalle = invPedidosOrdenCompraMotivo.ocmDetalle;
    motivoTOCopia.ocmEmpresa = invPedidosOrdenCompraMotivo.invPedidosOrdenCompraMotivoPK.ocmEmpresa;
    motivoTOCopia.ocmSector = invPedidosOrdenCompraMotivo.invPedidosOrdenCompraMotivoPK.ocmSector;
    motivoTOCopia.ocmNotificarProveedor = invPedidosOrdenCompraMotivo.ocmNotificarProveedor;
    motivoTOCopia.ocmCostoFijo = invPedidosOrdenCompraMotivo.ocmCostoFijo;
    return motivoTOCopia;
  }

  generarColumnasMotivoPedidoOrdenCompra(): Array<any> {
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'ocmCodigo',
        width: 250,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'ocmDetalle',
        width: 400,
        minWidth: 200
      },
      {
        headerName: LS.TAG_NOTIFICAR_PROVEEDOR,
        field: 'ocmNotificarProveedor',
        width: 200,
        minWidth: 150,
        cellRenderer: 'inputEstado',
        cellClass: 'text-center'
      },
      {
        headerName: LS.TAG_COSTO_FIJO,
        field: 'ocmCostoFijo',
        width: 100,
        minWidth: 100,
        cellRenderer: 'inputEstado',
        cellClass: 'text-center'
      },
      {
        headerName: LS.TAG_INACTIVO,
        field: 'ocmInactivo',
        width: 100,
        minWidth: 100,
        cellRenderer: 'inputEstado',
        cellClass: 'text-center'
      },
      this.utilService.getColumnaOpciones()
    ];
  }

  generarColumnasAprobador(contexto): any {
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
        minWidth: 200,
        valueGetter: (params) => {
          return params.data.usuario.usrNombre + " " + params.data.usuario.usrApellido;
        }
      }
    ];
    if (contexto.accion !== LS.ACCION_CONSULTAR) {
      columnas.push(
        this.utilService.getColumnaEliminar(null, contexto)
      );
    }
    return columnas;
  }

  inicializarAtajos(contexto) {
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (event: KeyboardEvent): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarMotivoOC') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarMotivoOC') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirMotivoOC') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarMotivoOC') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoMotivoOC') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (!contexto.vistaFormulario && contexto.objetoSeleccionado) {
        contexto.editarOrdenCompraMotivo(contexto.objetoSeleccionado);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (!contexto.vistaFormulario && contexto.objetoSeleccionado) {
        contexto.eliminarOrdenCompraMotivo(contexto.objetoSeleccionado);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      if (contexto.vistaFormulario) {
        let element: HTMLElement = document.getElementById('btnGuardarMotivoOC') as HTMLElement;
        element ? element.click() : null;
        return false;
      }
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      if (contexto.vistaFormulario) {
        let element: HTMLElement = document.getElementById('btnCancelarMotivoOC') as HTMLElement;
        element ? element.click() : null;
        return false;
      }
    }));
  }

}
