import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SoporteContableBonosService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarSoporteContableBonos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhDetalleBonosLoteTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarSoporteContableBonos(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirSoporteContableBonos(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteDetalleBonosLote", parametro, empresaSelect)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoSoporteContableBonos_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) :
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => { this.utilService.handleError(err, this); contexto.cargando = false; });
  }

  imprimirContable(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteContable", parametro, empresaSelect)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ConContableReport_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) :
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => { this.utilService.handleError(err, this); contexto.cargando = false; });
  }

  exportarSoporteContableBonos(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteSoporteContableDeBono", parametro, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoSoporteContableBonos_");
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
    ).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(isModal): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 38,
        minWidth: 38,
        maxWidth: 38,
      },
      {
        headerName: LS.TAG_FECHA,
        width: 100,
        minWidth: 100,
        field: 'dblFecha'
      },
      {
        headerName: LS.TAG_NUMERO_IDENTIFICACION,
        width: 200,
        minWidth: 200,
        field: 'dblId'
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        width: 250,
        minWidth: 250,
        field: 'dblNombres',
        cellClass: (params) => {
          return params.data.dblId ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_FORMA_PAGO,
        width: 150,
        minWidth: 150,
        field: 'dblFormaPagoDetalle'
      },
      {
        headerName: LS.TAG_NUMERO_DOCUMENTO,
        width: 150,
        minWidth: 150,
        field: 'dblDocumento'
      },
      {
        headerName: LS.TAG_VALOR,
        width: 100,
        minWidth: 100,
        field: 'dblValor',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: (params) => {
          let clase = params.data.dalId ? '' : 'tr-negrita';
          return (clase + ' text-right');
        }
      },
      {
        headerName: LS.TAG_OBSERVACION,
        width: 150,
        minWidth: 150,
        field: 'dblObservaciones'
      },
    );
    if (isModal) {
      columnas.push(
        this.utilService.getSpanSelect()
      );
    }
    return columnas;
  }

  generarPinnedBottonRowData(): Array<any> {
    return [
      {
        dblFecha: '',
        dblId: '',
        dblNombres: '',
        dblFormaPagoDetalle: '',
        dblDocumento: '',
        dblValor: '',
        dblObservaciones: '',
      }
    ]
  }
}
