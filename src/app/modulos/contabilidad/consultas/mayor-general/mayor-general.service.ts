import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MayorGeneralService {
  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }
  listarMayorGeneral(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/getListaMayorGeneralTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarMayorGeneral(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarMayorGeneral([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(contexto) {
    return [
      {
        headerName: LS.TAG_CUENTA,
        field: 'bgCuenta',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          if (params.data.bgCuenta && params.data.bgCuenta.length !== contexto.tamanioEstructura) {
            return 'tr-negrita ';
          } else {
            return 'text-whitespace ';
          }
        }
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'bgDetalle',
        width: 250,
        minWidth: 250,
        cellClass: (params) => {
          if (!params.data.bgCuenta || (params.data.bgCuenta && params.data.bgCuenta.length !== contexto.tamanioEstructura)) {
            return 'tr-negrita text-whitespace';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_SALDO6,
        field: 'bgSaldo6',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.bgCuenta || (params.data.bgCuenta && params.data.bgCuenta.length !== contexto.tamanioEstructura)) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_SALDO5,
        field: 'bgSaldo5',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.bgCuenta || (params.data.bgCuenta && params.data.bgCuenta.length !== contexto.tamanioEstructura)) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_SALDO4,
        field: 'bgSaldo4',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.bgCuenta || (params.data.bgCuenta && params.data.bgCuenta.length !== contexto.tamanioEstructura)) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_SALDO3,
        field: 'bgSaldo3',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.bgCuenta || (params.data.bgCuenta && params.data.bgCuenta.length !== contexto.tamanioEstructura)) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_SALDO2,
        field: 'bgSaldo2',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.bgCuenta || (params.data.bgCuenta && params.data.bgCuenta.length !== contexto.tamanioEstructura)) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_SALDO1,
        field: 'bgSaldo1',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.bgCuenta || (params.data.bgCuenta && params.data.bgCuenta.length !== contexto.tamanioEstructura)) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
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
        cellClass: 'text-md-center',
        cellRendererParams: (params) => {
          if (params.data.bgCuenta && params.data.bgCuenta.length === contexto.tamanioEstructura) {
            return {
              icono: LS.ICON_CONSULTAR,
              tooltip: LS.MSJ_CONSULTAR_MAYOR_AUXILIAR,
              accion: LS.ACCION_CONSULTAR
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

  }

}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
