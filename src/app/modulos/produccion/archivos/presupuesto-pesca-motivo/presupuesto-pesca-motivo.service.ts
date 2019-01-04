import { Injectable } from '@angular/core';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoPescaMotivoService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarPresupuestoPescaMotivo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getListaPrdPresupuestoPescaMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarPresupuestoPescaMotivo(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  insertarPresupuestoPescaMotivo(parametro, contexto, presupuestoCopia, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/insertarPrdPresupuestoPescaMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarPresupuestoPescaMotivo(respuesta.extraInfo, presupuestoCopia);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  actualizarPresupuestoPMotivo(parametro, contexto, presupuestoCopia, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/modificarPrdPresupuestoPescaMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeActualizarPrespuestoMotivo(respuesta.extraInfo, presupuestoCopia);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirPresupuestoPesca(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReportePresupuestoPesca", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoPrdPresupuestoPesca.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarPresupuestoPesca(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReportePresupuestoPesca", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoPresupuestoPesca_");
        } else {
          this.toastr.warning("No se encontraron resultados");
        }
        contexto.cargando = false;
      }
      ).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'prdPresupuestoPescaMotivoPK.presuCodigo',
        width: 50,
        minWidth: 50,
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'presuDetalle',
        width: 150,
        minWidth: 150,
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'cell-header-center',
        field: 'presuInactivo',
        width: 50,
        minWidth: 50,
        cellRenderer: "inputEstado",
        cellClass: 'text-center'
      },
      this.utilService.getColumnaOpciones()
    ]
  }
}
