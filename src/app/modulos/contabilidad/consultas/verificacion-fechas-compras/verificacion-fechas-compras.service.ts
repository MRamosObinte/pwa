import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VerificacionFechasComprasService {
  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }
  listarVerificacionesFechasCompras(parametro, contexto, empresaSelect) {
    contexto.filasTiempo ? contexto.filasTiempo.iniciarContador() : null;
    this.api.post("todocompuWS/contabilidadWebController/getConFunContablesVerificacionesComprasTOs", parametro, empresaSelect)
      .then(respuesta => {
        contexto.filasTiempo ? contexto.filasTiempo.finalizarContador() : null;
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarVerificacionesFechasCompras(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarVerificacionesFechasCompras([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_FECHA_CONTABILIDAD,
        field: 'contabilidadFecha',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_FECHA_INVENTARIO,
        field: 'inventarioFecha',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_MONTO,
        field: 'inventarioMonto',
        width: 200,
        minWidth: 200,
        cellClass: ' text-md-right',
        valueFormatter: numberFormat
      }
    ];
  }
}

function numberFormat(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2')
}
