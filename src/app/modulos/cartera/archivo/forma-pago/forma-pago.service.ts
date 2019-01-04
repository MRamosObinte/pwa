import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService
  ) { }

  listarCarListaPagosCobrosFormaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/getCarListaPagosCobrosFormaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarCarListaPagosCobrosFormaTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarCarListaPagosCobrosFormaTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  accionCarPagosForma(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/accionCarPagosForma", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          respuesta.formaPago = parametro.carPagosCobrosFormaTO;
          contexto.despuesDeAccionCarPagosForma(respuesta);
        } else {
          contexto.despuesDeAccionCarPagosForma(null);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarEstadoFormaPago(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/modificarEstadoCarPagosForma", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          respuesta.formaPago = parametro.carPagosCobrosFormaTO;
          contexto.despuesDeModificarEstadoFormaPago(respuesta);
        } else {
          contexto.despuesDeModificarEstadoFormaPago(null);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirFormaPago(contexto, parametros, empresaSelect) {
    contexto.cargando = true;
    this.archivoService.postPDF("todocompuWS/carteraWebController/generarReporteCarReporteFormaCobroPago", parametros, empresaSelect)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoFormaPago.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarFormaPago(contexto, parametros, empresaSelect) {
    contexto.cargando = true;
    this.archivoService.postExcel("todocompuWS/carteraWebController/exportarReporteCarReporteFormaCobroPago", parametros, empresaSelect)
      .then(data => {
        (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoFormaPago_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  seleccionarSector(listaSectores, codigo) {
    return listaSectores.find(item => item.secCodigo == codigo);
  }

  verificarPermiso(accion, contexto, mostrarMensaje?): boolean {
    let permiso = false;
    switch (accion) {
      case LS.ACCION_CREAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruCrear;
        break;
      }
      case LS.ACCION_EDITAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruModificar;
        break;
      }
      case LS.ACCION_ELIMINAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
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

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CUENTA,
        field: 'ctaCodigo',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'fpDetalle',
        width: 400,
        minWidth: 400
      },
      {
        headerName: LS.TAG_SECTOR,
        field: 'secCodigo',
        width: 90,
        minWidth: 90
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'fpInactivo',
        width: 115,
        minWidth: 115,
        cellRenderer: "inputEstado",
        cellClass: 'text-md-center'
      },
      this.utilService.getColumnaOpciones()
    ];

    return columnDefs;
  }
}
