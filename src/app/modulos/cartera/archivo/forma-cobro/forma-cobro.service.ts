import { Injectable } from '@angular/core';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class FormaCobroService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService
  ) { }

  accionCarCobrosForma(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/accionCarCobrosForma", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          respuesta.formaCobro = parametro.carPagosCobrosFormaTO;
          contexto.despuesDeAccionCarCobroForma(respuesta);
        } else {
          contexto.despuesDeAccionCarCobroForma(null);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarEstadoFormaCobro(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/modificarEstadoCarCobroForma", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          respuesta.formaCobro = parametro.carPagosCobrosFormaTO;
          contexto.despuesDeModificarEstadoFormaCobro(respuesta);
        } else {
          contexto.despuesDeModificarEstadoFormaCobro(null);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirFormaCobro(contexto, parametros, empresaSelect) {
    contexto.cargando = true;
    this.archivoService.postPDF("todocompuWS/carteraWebController/generarReporteCarReporteFormaCobroPago", parametros, empresaSelect)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoFormaCobro.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarFormaCobro(contexto, parametros, empresaSelect) {
    contexto.cargando = true;
    this.archivoService.postExcel("todocompuWS/carteraWebController/exportarReporteCarReporteFormaCobroPago", parametros, empresaSelect)
      .then(data => {
        (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoFormaCobro_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
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
  
  seleccionarSector(listaSectores, codigo) {
    return listaSectores.find(item => item.secCodigo == codigo);
  }

}
