import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ListadoDevolucionIvaComprasService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnxFunListadoDevolucionIva(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnxFunListadoDevolucionIvaTOs", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarAnexoListadoDevolucionIVA([]);
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarAnexoListadoDevolucionIVA(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnexoListadoDevolucionIVA([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_SUST_T,
        field: 'actSustentoTributario',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_SUSTENTO_TRIBUTARIO,
          text: LS.TAG_SUST_T
        }
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'actFecha',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'actProveedorNombre',
        width: 200,
        minWidth: 200,
        cellClass: (params) => {
          if (params.data.actProveedorIdTipo === null) {
            return 'tr-negrita textoMayuscula';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_TIPO_ID,
        field: 'actProveedorIdTipo',
        width: 70,
        minWidth: 70,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_TIPO_IDENTIFICACION,
          text: LS.TAG_TIPO_ID
        }
      },
      {
        headerName: LS.TAG_NUMERO_ID,
        field: 'actProveedorIdNumero',
        width: 150,
        minWidth: 150,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_NUMERO_IDENTIFICACION,
          text: LS.TAG_NUMERO_ID
        }
      },
      {
        headerName: LS.TAG_T_DOCUMENTO,
        field: 'actDocumentoTipo',
        width: 80,
        minWidth: 80,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_TIPO_DOCUMENTO,
          text: LS.TAG_T_DOCUMENTO
        }
      },
      {
        headerName: LS.TAG_NUMERO_DOCUMENTO,
        field: 'actDocumentoNumero',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_AUTORIZACION,
        field: 'actAutorizacion',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_BASE_0,
        field: 'actBase0',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (params.data.actProveedorIdTipo === null) {
            return 'tr-negrita textoMayuscula';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_BASE_IMPONIBLE,
        field: 'actBaseImponible',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (params.data.actProveedorIdTipo === null) {
            return 'tr-negrita textoMayuscula';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_IVA,
        field: 'actIva',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (params.data.actProveedorIdTipo === null) {
            return 'tr-negrita textoMayuscula';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'actTotal',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (params.data.actProveedorIdTipo === null) {
            return 'tr-negrita textoMayuscula';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_CLAVE_ACCESO_RETENCION,
        field: 'actClaveAccesoRetencion',
        width: 400,
        minWidth: 180,
      },
      {
        headerName: LS.TAG_NEC_SOP,
        field: 'actNecesitaSoporte',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_NECESITA_SOPORTE,
          text: LS.TAG_NEC_SOP
        }
      }
    ];
  }
}
function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}