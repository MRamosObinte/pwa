import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ListadoChequesCobrarService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  verificarPermiso(accion, contexto, mostrarMensaje?): boolean {
    let permiso = false;
    switch (accion) {
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_IMPRIMIR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruImprimir;
        break;
      }
      case LS.ACCION_EXPORTAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruExportar;
        break;
      }
    }
    if (mostrarMensaje && !permiso) {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO)
    }
    return permiso;
  }

  listarChequesCobrarTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/getBanListaChequeTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta  && respuesta.extraInfo) {
          contexto.despuesDeListarChequesCobrarTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarChequesCobrarTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_BENEFICIARIO,
        field: 'chqBeneficiario',
        width: 210,
        minWidth: 210,
        cellClass: (params) => { return (!params.data.chqCuentaCodigo) ? 'tr-negrita' : 'text-whitespace' },
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'chqNumero',
        width: 55,
        minWidth: 55
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'chqValor',
        width: 50,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.chqCuentaCodigo) ? 'tr-negrita text-right' : 'text-whitespace text-right' },
      },
      {
        headerName: LS.TAG_EMISION,
        field: 'chqFechaEmision',
        width: 55,
        minWidth: 55
      },
      {
        headerName: LS.TAG_VENCIMIENTO,
        field: 'chqFechaVencimiento',
        width: 70,
        minWidth: 70
      },
      {
        headerName: LS.TAG_IMPRESO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'chqImpreso',
        width: 55,
        minWidth: 55,
        cellRenderer: "inputEstado",
        cellClass: (params) => {
          if (!params.data.chqCuentaCodigo) {
            return 'd-none text-center'
          } else {
            return 'text-center';
          }
        }
      },
      {
        headerName: LS.TAG_REVISADO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'chqRevisado',
        width: 60,
        minWidth: 60,
        cellRenderer: "inputEstado",
        cellClass: (params) => {
          if (!params.data.chqCuentaCodigo) {
            return 'd-none text-center'
          } else {
            return 'text-center';
          }
        }
      },
      {
        headerName: LS.TAG_ENTREGADO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'chqEntregado',
        width: 63,
        minWidth: 63,
        cellRenderer: "inputEstado",
        cellClass: (params) => {
          if (!params.data.chqCuentaCodigo) {
            return 'd-none text-center'
          } else {
            return 'text-center';
          }
        }
      },
      {
        headerName: LS.TAG_CONTABLE,
        field: 'chqCuentaCodigo',
        width: 105,
        minWidth: 105,
        valueGetter: (params) => { return params.data.chqCuentaCodigo ? (params.node.data.chqContablePeriodo + " | " + params.node.data.chqContableTipo + " | " + params.node.data.chqContableNumero) : "" },
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',
        field: '',
        width: 40,
        minWidth: 40,
        cellRenderer: "botonOpciones",
        cellClass: 'text-md-center',
        cellRendererParams: (params) => {
          if (params.data.chqCuentaCodigo) {
            return {
              icono: LS.ICON_CONSULTAR,
              tooltip: LS.ACCION_VER_COMPROBANTE,
              accion: LS.ACCION_CONSULTAR,
            };
          } else {
            return {
              icono: null,
              tooltip: null,
              accion: null
            };
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
    return columnDefs;
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
