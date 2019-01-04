import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Injectable({
  providedIn: 'root'
})
export class RetencionesRentaComprasListadoSimpleService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnexoListaRetencionesTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnexoListaRetencionesTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarAnexoListaRetencionesTO([]);
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarAnexoListaRetencionesTO(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnexoListaRetencionesTO([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_SUSTENTO_TRIBUTARIO,
        field: 'retSustentoTributario',
        width: 200,
        minWidth: 100,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return 'tr-negrita textoMayuscula';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_N_IDENTIFICACION,
        field: 'retProveedorId',
        width: 150,
        minWidth: 150,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_NUMERO_IDENTIFICACION,
          text: LS.TAG_N_IDENTIFICACION
        },
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_PROVEEDOR,
        field: 'retProveedorNombre',
        width: 600,
        minWidth: 300,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-left tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_DOCUMENTO_NOMBRE,
        field: 'retDocumentoNombre',
        width: 300,
        minWidth: 200,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_DOCUMENTO_NUMERO,
        field: 'retDocumentoNumero',
        width: 200,
        minWidth: 100,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_COMPRA_FECHA,
        field: 'retCompraFecha',
        width: 200,
        minWidth: 100,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_COMPRA_BASE_CERO,
        field: 'retCompraBase0',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_COMPRA_BASE_IMPONIBLE,
        field: 'retCompraBaseImponible',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_C_IVA_VIGENTE,
        field: 'retIvavigente',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_COMPRA_IVA_VIGENTE,
          text: LS.TAG_C_IVA_VIGENTE
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
        headerName: LS.TAG_COMPRA_MONTO_IVA,
        field: 'retCompraMontoIva',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_RETENCION_AUTORIZACION,
        field: 'retRetencionAutorizacion',
        width: 200,
        minWidth: 100,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_RETENCION_NUMERO,
        field: 'retRetencionNumero',
        width: 200,
        minWidth: 100,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_RETENCION_FECHA,
        field: 'retRetencionFecha',
        width: 200,
        minWidth: 100,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_VALOR_RET_IR,
        field: 'retValorRetenidoIr',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_VALOR_RETENIDO_IR,
          text: LS.TAG_VALOR_RET_IR
        }
      },
      {
        headerName: LS.TAG_VALOR_RETENIDO_IVA,
        field: 'retValorRetenidoIva',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_TOTAL_RETENIDO,
        field: 'retTotalRetenido',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
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


