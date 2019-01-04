import { PinnedCellComponent } from './../../../componentes/pinned-cell/pinned-cell.component';
import { TooltipReaderComponent } from './../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonOpcionesComponent } from './../../../componentes/boton-opciones/boton-opciones.component';
import { LS } from './../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { ApiRequestService } from './../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaldoConsolidadoAnticiposPrestamosService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listaRhSaldoConsolidadoAnticiposPrestamosTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhSaldoConsolidadoAnticiposPrestamosTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarRhSaldoConsolidadoAnticiposPrestamosTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarRhSaldoConsolidadoAnticiposPrestamosTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_CATEGORIA,
        field: 'scapCategoria',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          return (!params.data.scapId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_IDENTIFICACION,
        field: 'scapId',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          return (!params.data.scapId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        field: 'scapNombres',
        width: 250,
        minWidth: 250,
        cellClass: (params) => {
          return (!params.data.scapId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_ANTICIPOS,
        field: 'scapAnticipos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.scapId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_PRESTAMOS,
        field: 'scapPrestamos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.scapId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'scapTotal',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.scapId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        cellClass: (params) => { return (!params.data.scapId) ? 'd-none' : 'text-center' },
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRendererFramework: BotonOpcionesComponent,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: '',
          enableSorting: false
        },
        pinnedRowCellRenderer: PinnedCellComponent,
      }
    ];
  }
}


function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}