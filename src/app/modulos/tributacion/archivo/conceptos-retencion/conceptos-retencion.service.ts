import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ConceptosRetencionService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnexoConceptoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnexoConceptoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarAnexoConcepto(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnexoConcepto([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarAnxConceptoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getListaAnxConceptoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarAnxConceptoTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnasModal() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'conCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'conConcepto',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_PORCENTAJE,
        field: 'conPorcentaje',
        width: 100,
        minWidth: 100,
      },
      {
        headerName: LS.TAG_INGRESOS + " (%)",
        field: 'conIngresaPorcentaje',
        width: 100,
        minWidth: 100,
      }
    ];

    return columnDefs;
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'conCodigo',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_CONCEPTO,
        field: 'conConcepto',
        width: 400,
        minWidth: 400
      },
      {
        headerName: LS.TAG_PORCENTAJE,
        field: 'conPorcentaje',
        width: 200,
        minWidth: 200,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      },
      {
        headerName: LS.TAG_FECHA_INICIO,
        field: 'fechaInicio',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_FECHA_FIN,
        headerClass: 'cell-header-center',
        field: 'fechaFin',
        width: 100,
        minWidth: 100
      }
    ];
  }
}
function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}

