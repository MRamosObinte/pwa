import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RetencionesComprasVerificarSecuenciaService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnexoListaRetencionesPorNumeroTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnexoFunListadoRetencionesPorNumero", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarAnexoListaRetencionesPorNumeroTO([]);
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarAnexoListaRetencionesPorNumeroTO(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnexoListaRetencionesPorNumeroTO([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_SUST_T,
        field: 'retSustentoTributario',
        width: 80,
        minWidth: 80,
        cellClass: (params) => {
          if (!params.data.retProveedorId) {
            return 'tr-negrita textoMayuscula';
          } else {
            return ' ';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_SUSTENTO_TRIBUTARIO,
          text: LS.TAG_SUST_T
        }
      },
      {
        headerName: LS.TAG_PROVEEDOR,
        field: 'retProveedorNombre',
        width: 300,
        minWidth: 200,
        cellClass: (params) => {
          if (params.data.retProveedorNombre === LS.TAG_TOTALES) {
            return 'tr-negrita textoMayuscula';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_DOCUMENTO_NOMBRE,
        field: 'retDocumentoNombre',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          if (!params.data.retProveedorId) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_DOCUMENTO_NUMERO,
        field: 'retDocumentoNumero',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          if (!params.data.retProveedorId) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_COMPRA_FECHA,
        field: 'retCompraFecha',
        width: 120,
        minWidth: 120,
        cellClass: (params) => {
          if (!params.data.retProveedorId) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_COMPRA_B_CERO,
        field: 'retCompraBase0',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.retProveedorId) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_COMPRA_BASE_CERO,
          text: LS.TAG_COMPRA_B_CERO
        }
      },
      {
        headerName: LS.TAG_COMPRA_B_IMPONIBLE,
        field: 'retCompraBaseImponible',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.retProveedorId) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_COMPRA_BASE_IMPONIBLE,
          text: LS.TAG_COMPRA_B_IMPONIBLE
        }
      },
      {
        headerName: LS.TAG_COMPRA_MONT_IVA,
        field: 'retCompraMontoIva',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.retProveedorId) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_COMPRA_MONTO_IVA,
          text: LS.TAG_COMPRA_MONT_IVA
        }
      },
      {
        headerName: LS.TAG_RET_AUTORIZACION,
        field: 'retRetencionAutorizacion',
        width: 200,
        minWidth: 140,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_RETENCION_AUTORIZACION,
          text: LS.TAG_RET_AUTORIZACION
        }
      },
      {
        headerName: LS.TAG_RETENCION_NUMERO,
        field: 'retRetencionNumero',
        width: 200,
        minWidth: 150,
      },
      {
        headerName: LS.TAG_RETENCION_FECHA,
        field: 'retRetencionFecha',
        width: 200,
        minWidth: 150,
      },
      {
        headerName: LS.TAG_VALOR_RET_IR,
        field: 'retValorRetenidoIr',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_VALOR_RETENIDO_IR,
          text: LS.TAG_VALOR_RET_IR
        },
        cellClass: (params) => {
          if (!params.data.retProveedorId) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_V_RETENIDO_IVA,
        field: 'retValorRetenidoIva',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_VALOR_RETENIDO_IVA,
          text: LS.TAG_V_RETENIDO_IVA
        },
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_T_RETENIDO,
        field: 'retTotalRetenido',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_TOTAL_RETENIDO,
          text: LS.TAG_T_RETENIDO
        },
        cellClass: (params) => {
          if (!params.data.retProveedorId) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      this.utilService.getColumnaOpciones()
    ];
  }
}
function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
