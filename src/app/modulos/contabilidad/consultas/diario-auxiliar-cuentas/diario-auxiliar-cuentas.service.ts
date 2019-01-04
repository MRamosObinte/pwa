import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DiarioAuxiliarCuentasService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }
  listarDiarioAuxiliar(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/getListaDiarioAuxiliarTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarDiarioAuxiliar(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarDiarioAuxiliar([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_ORDEN,
        field: 'daOrden',
        width: 100,
        minWidth: 100,
        cellClass: (params) => {
          if (!params.data.daOrden) {
            return 'tr-negrita ';
          } else { return ''; }
        }
      },
      {
        headerName: LS.TAG_CUENTA,
        field: 'daCuenta',
        width: 200,
        minWidth: 150,
        valueFormatter: (params) => {
          if (params.data.daCuenta) {
            return params.data.daCuenta.split('+').join('')
          } else {
            return null;
          }
        },
        cellClass: (params) => {
          if (!params.data.daOrden) {
            return 'tr-negrita textoMayuscula';
          } else { return ''; }
        }
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'daDetalle',
        width: 300,
        minWidth: 250,
        valueFormatter: (params) => {
          if (params.data.daDetalle) {
            return params.data.daDetalle.split('>').join('')
          } else {
            return null;
          }
        },
        cellClass: (params) => {
          if (!params.data.daOrden) {
            return 'tr-negrita textoMayuscula';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_CP,
        field: 'daCP',
        width: 100,
        minWidth: 80,
        cellClass: (params) => {
          if (!params.data.daOrden) {
            return 'tr-negrita textoMayuscula';
          } else { return ''; }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_CENTRO_PRODUCCION,
          text: LS.TAG_CP
        }
      },
      {
        headerName: LS.TAG_CC,
        field: 'daCC',
        width: 100,
        minWidth: 80,
        valueFormatter: (params) => {
          if (params.data.daCC) {
            return params.data.daCC.split('+').join('')
          } else {
            return null;
          }
        },
        cellClass: (params) => {
          if (!params.data.daOrden) {
            return 'tr-negrita textoMayuscula';
          } else { return ''; }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_CENTRO_COSTO,
          text: LS.TAG_CC
        }
      },
      {
        headerName: LS.TAG_DOCUMENTO,
        field: 'daDocumento',
        width: 200,
        minWidth: 140,
        valueFormatter: (params) => {
          if (params.data.daDocumento) {
            return params.data.daDocumento.split('+').join('')
          } else {
            return null;
          }
        },
        cellClass: (params) => {
          if (!params.data.daOrden) {
            return 'tr-negrita textoMayuscula';
          } else { return ''; }
        }
      },
      {
        headerName: LS.TAG_DEBE,
        field: 'daDebe',
        width: 100,
        minWidth: 80,
        valueFormatter: (params) => {
          if (params.data.daDebe !== 'Debe') {
            return new DecimalPipe('en-US').transform(params.value, '1.2-2')
          } else {
            return null;
          }
        },
        cellClass: (params) => {
          if (!params.data.daOrden) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_HABER,
        field: 'daHaber',
        width: 100,
        minWidth: 80,
        valueFormatter: (params) => {
          if (params.data.daHaber !== 'Haber') {
            return new DecimalPipe('en-US').transform(params.value, '1.2-2')
          } else {
            return null;
          }
        },
        cellClass: (params) => {
          if (!params.data.daOrden) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      }
    ];
  }

}


