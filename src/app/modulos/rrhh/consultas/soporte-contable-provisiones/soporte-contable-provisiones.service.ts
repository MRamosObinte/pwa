import { DecimalPipe } from '@angular/common';
import { BotonOpcionesComponent } from './../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from './../../../componentes/tooltip-reader/tooltip-reader.component';
import { LS } from './../../../../constantes/app-constants';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from './../../../../serviciosgenerales/api-request.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoporteContableProvisionesService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listaRhListaProvisionesComprobanteContableTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhListaProvisionesComprobanteContableTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarRhListaProvisionesComprobanteContableTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarRhListaProvisionesComprobanteContableTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }


  generarColumnas() {
    return [
      {
        headerName: LS.TAG_CATEGORIA,
        field: 'provCategoria',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          return (!params.data.provId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_IDENTIFICACION,
        field: 'provId',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          return (!params.data.provId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        field: 'provNombres',
        width: 250,
        minWidth: 250,
        cellClass: (params) => {
          return (!params.data.provId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_SUELDO,
        field: 'provSueldo',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.provId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_DIAS_PAGADOS,
        field: 'provDiasPagados',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.provId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_APORTE_INDIVIDUAL,
        field: 'provAporteIndividual',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.provId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_APORTE_PATRONAL,
        field: 'provAportePatronal',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.provId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_IECE,
        field: 'provIece',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.provId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_IECE_SIN_ABREVIACION, text: LS.TAG_IECE },
      },
      {
        headerName: LS.TAG_SECAP,
        field: 'provSecap',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.provId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_SECAP_SIN_ABREVIACION, text: LS.TAG_SECAP },
      },
      {
        headerName: LS.TAG_XIII_SUELDO,
        field: 'provXiii',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.provId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_XIV_SUELDO,
        field: 'provXiv',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.provId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_FONDO_RESERVA,
        field: 'provFondoReserva',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.provId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_CONTABLE_ROL,
        field: 'provContableRol',
        width: 250,
        minWidth: 250,
        cellClass: (params) => {
          return (!params.data.provId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_CONTABLE_PROVISION,
        field: 'provContableProvision',
        width: 250,
        minWidth: 250,
        cellClass: (params) => {
          return (!params.data.provId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        cellClass: (params) => { return (!params.data.provId) ? 'd-none' : 'text-center' },
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRendererFramework: BotonOpcionesComponent,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: '',
          enableSorting: false
        }
      }
    ];
  }
}



function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
