import { Injectable } from '@angular/core';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class PreLiquidacionMotivoService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarPreLiquidacionMotivo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getListaPrdPreLiquidacionMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarPreLiquidacionMotivo(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  insertarPrdPreLiquidacionMotivo(parametro, contexto, liquidacionCopia, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/insertarPrdPreLiquidacionMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarPreLiquidacionMotivo(respuesta.extraInfo, liquidacionCopia);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  actualizarPreLiquidacionMotivo(parametro, contexto, liquidacionCopia, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/modificarPrdPreLiquidacionMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeActualizarPreLiquidacionMotivo(respuesta.extraInfo, liquidacionCopia);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirPreLiquidacionMotivo(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReportePreLiquidacionMotivo", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoPrdPreLiquidacionMotivo.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarPreLiquidacionMotivo(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReportePreLiquidacionMotivo", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoPreLiquidacionMotivo_");
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
        field: 'prdPreLiquidacionMotivoPK.plmCodigo',
        width: 50,
        minWidth: 50,
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'plmDetalle',
        width: 150,
        minWidth: 150,
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'cell-header-center',
        field: 'plmInactivo',
        width: 50,
        minWidth: 50,
        cellRenderer: "inputEstado",
        cellClass: 'text-center'
      },
      this.utilService.getColumnaOpciones()
    ]
  }
}
