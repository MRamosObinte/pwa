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
export class RetencionesIvaComprasService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnexoListaRetencionesFuentesIva(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnexoListaRetencionesFuenteIvaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarAnexoListaRetencionesFuentesIva([]);
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarAnexoListaRetencionesFuentesIva(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnexoListaRetencionesFuentesIva([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_SUSTENTO_TRIBUTARIO,
        field: 'retSustentotributario',
        width: 200,
        minWidth: 100,
        cellClass: (params) => {
          if ((params.data.retSustentotributario === null)) {
            return 'tr-negrita textoMayuscula';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_PORCENTAJE,
        field: 'retPorcentaje',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.retSustentotributario === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
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
          if ((params.data.retSustentotributario === null)) {
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
          if ((params.data.retSustentotributario === null)) {
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
          if ((params.data.retSustentotributario === null)) {
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
          if ((params.data.retSustentotributario === null)) {
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
          if ((params.data.retSustentotributario === null)) {
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
          if ((params.data.retSustentotributario === null)) {
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
          if ((params.data.retSustentotributario === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_DOCUMENTO_AUTORIZACION,
        field: 'retDocumentoAutorizacion',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.retSustentotributario === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_RETENCION_AUTORIZACION,
        field: 'retRetencionAutorizacion',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.retSustentotributario === null)) {
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
          if ((params.data.retSustentotributario === null)) {
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
          if ((params.data.retSustentotributario === null)) {
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
        headerName: LS.TAG_RETENCION_FECHA,
        field: 'retRetencionFecha',
        width: 200,
        minWidth: 100,
        cellClass: (params) => {
          if ((params.data.retSustentotributario === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_COMPRA,
        field: 'retLlaveCompra',
        width: 200,
        minWidth: 100,
        cellClass: (params) => {
          if ((params.data.retSustentotributario === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_CONTABLE,
        field: 'retLlaveContable',
        width: 180,
        minWidth: 180,
        cellClass: (params) => {
          if ((params.data.retSustentotributario === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRenderer: "botonOpciones",
        cellClass: (params) => {
          if (!params.data.retSustentotributario) {
            return 'text-center ag-hidden';
          } else {
            return 'text-center';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: ''
        }
      }
    ];
  }
}
function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
