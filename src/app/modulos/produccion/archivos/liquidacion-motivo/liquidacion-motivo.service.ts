import { Injectable } from '@angular/core';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionMotivoService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarLiquidacionMotivoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getListaPrdLiquidacionMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarLiquidacionMotivo(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  insertarLiquidacionMotivo(parametro, contexto, liquidacionCopia, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/insertarPrdLiquidacionMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarLiquidacionMotivo(respuesta.extraInfo, liquidacionCopia);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  actualizarLiquidacionMotivo(parametro, contexto, liquidacionCopia, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/modificarPrdLiquidacionMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeModificarLiquidacionMotivo(respuesta.extraInfo, liquidacionCopia);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirLiquidacionMotivo(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteLiquidacionMotivo", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoPrdLiquidacionMotivo.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarLiquidacionMotivo(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReporteLiquidacionMotivo", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoLiquidacionMotivo_");
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
        field: 'prdLiquidacionMotivoPK.lmCodigo',
        width: 50,
        minWidth: 50,
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'lmDetalle',
        width: 150,
        minWidth: 150,
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'cell-header-center',
        field: 'lmInactivo',
        width: 50,
        minWidth: 50,
        cellRenderer: "inputEstado",
        cellClass: 'text-center'
      },
      this.utilService.getColumnaOpciones()
    ]
  }
}
