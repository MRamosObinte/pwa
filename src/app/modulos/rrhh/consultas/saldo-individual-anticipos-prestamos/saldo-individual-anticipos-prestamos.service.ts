import { DecimalPipe } from '@angular/common';
import { LS } from './../../../../constantes/app-constants';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from './../../../../serviciosgenerales/api-request.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaldoIndividualAnticiposPrestamosService {


  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listaRhSaldoIndividualAnticiposPrestamosTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhSaldoIndividualAnticiposPrestamosTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarRhSaldoIndividualAnticiposPrestamosTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarRhSaldoIndividualAnticiposPrestamosTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }


  generarColumnas(tipo) {
    return [
      {
        headerName: LS.TAG_TIPO,
        field: 'siapTipo',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          return (!params.data.siapTipo) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'siapFecha',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          return (!params.data.siapTipo) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'siapObservaciones',
        width: 250,
        minWidth: 250,
        cellClass: (params) => {
          return (!params.data.siapTipo) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_DEBITOS,
        field: 'siapDebitos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.siapTipo) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_CREDITOS,
        field: 'siapCreditos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.siapTipo) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_SALDO,
        field: 'siapSaldo',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.siapTipo) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_CONTABLE,
        field: 'siapContable',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          return (!params.data.siapTipo) ? 'tr-negrita text-right' : 'text-right';
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
          if (!params.data.siapTipo) {
            return {
              icono: null,
              tooltip: null,
              accion: null
            };
          } else {
            return {
              icono: LS.ICON_CONSULTAR,
              tooltip: LS.MSJ_CONSULTAR_CONTABLE,
              accion: LS.ACCION_CONSULTAR
            };
          }
        }
        ,
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