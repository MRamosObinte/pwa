import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ListadoDevolucionIvaVentasService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnxFunListadoDevolucionIvaVentas(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnxFunListadoDevolucionIvaVentasTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarAnexoListadoDevolucionIVAVentas([]);
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarAnexoListadoDevolucionIVAVentas(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnexoListadoDevolucionIVAVentas([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_IDENTIFICACION,
        field: 'venIdentificacion',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'venNombre',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_COMPROBANTE,
        field: 'venComprobanteTipo',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_SERIE,
        field: 'venComprobanteSerie',
        width: 70,
        minWidth: 70
      },
      {
        headerName: LS.TAG_SECUENCIA,
        field: 'venComprobanteSecuencia',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_AUT_FISICA,
        field: 'venAutorizacionFisica',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_AUTORIZACION_FISICA,
          text: LS.TAG_AUT_FISICA
        }
      },
      {
        headerName: LS.TAG_AUT_ELECTRONICA,
        field: 'venAutorizacionElectronica',
        width: 200,
        minWidth: 200,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_AUTORIZACION_ELECTRONICA,
          text: LS.TAG_AUT_ELECTRONICA
        }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'venTotal',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right'
      }
    ];
  }
}
function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
