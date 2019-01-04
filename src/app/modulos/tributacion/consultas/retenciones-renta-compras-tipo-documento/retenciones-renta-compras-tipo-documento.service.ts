import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';

@Injectable({
  providedIn: 'root'
})
export class RetencionesRentaComprasTipoDocumentoService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnexoListaRetencionesRentaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnexoListaRetencionesRentaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarAnexoListaRetencionesRentaTO([]);
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarAnexoListaRetencionesRentaTO(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnexoListaRetencionesRentaTO([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_SUST_T,
        field: 'retSustentotributario',
        width: 100,
        minWidth: 100,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
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
        headerName: LS.TAG_CONCEPTO,
        field: 'retConcepto',
        width: 100,
        minWidth: 100,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_N_IDENTIFICACION,
        field: 'retProveedorId',
        width: 130,
        minWidth: 130,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_NUMERO_IDENTIFICACION,
          text: LS.TAG_N_IDENTIFICACION
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
        width: 200,
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
        headerName: LS.TAG_D_NUMERO,
        field: 'retDocumentoNumero',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_DOCUMENTO_NUMERO,
          text: LS.TAG_D_NUMERO
        }
      },
      {
        headerName: LS.TAG_COMPRA_FECHA,
        field: 'retCompraFecha',
        width: 120,
        minWidth: 120,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
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
          if ((params.data.retProveedorId === null)) {
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
          if ((params.data.retProveedorId === null)) {
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
        headerName: LS.TAG_DOC_AUTORIZACION,
        field: 'retDocumentoAutorizacion',
        width: 200,
        minWidth: 100,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_DOCUMENTO_AUTORIZACION,
          text: LS.TAG_DOC_AUTORIZACION
        }
      },
      {
        headerName: LS.TAG_RET_AUTORIZACION,
        field: 'retRetencionAutorizacion',
        width: 200,
        minWidth: 100,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        },
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
        width: 160,
        minWidth: 160,
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
        width: 100,
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
        headerName: LS.TAG_CONTABLE,
        field: 'retLlavecontable',
        width: 180,
        minWidth: 180,
        cellClass: (params) => {
          if ((params.data.retProveedorId === null)) {
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
        cellRendererFramework: BotonOpcionesComponent,
        cellClass: (params) => {
          if (!params.data.retSustentotributario) {
            return 'ag-hidden';
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