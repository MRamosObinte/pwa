import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { PinnedCellComponent } from '../../../componentes/pinned-cell/pinned-cell.component';

@Injectable({
  providedIn: 'root'
})
export class ProvisionesService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarProvisiones(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhListaProvisionesTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarProvisiones(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarProvision(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/insertarModificarRhProvisiones", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarProvison(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirProvision(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteProvision", parametro, empresaSelect)
      .then(data => {
        (data) ? this.utilService.descargarArchivoPDF('ListaProvision' + this.utilService.obtenerHorayFechaActual() + '.pdf', data)
          : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(isModal): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_CATEGORIA,
        width: 150,
        minWidth: 150,
        field: 'provCategoria',
        cellClass: (params) => {
          return params.data.provCategoria ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_NUMERO_IDENTIFICACION,
        width: 200,
        minWidth: 200,
        field: 'provId'
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        width: 250,
        minWidth: 250,
        field: 'provNombres',
        cellClass: (params) => {
          return params.data.provId ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_SUELDO,
        width: 100,
        minWidth: 100,
        field: 'provSueldo',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: (params) => {
          return params.data.provId ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_DIAS_PAGADOS,
        width: 120,
        minWidth: 120,
        field: 'provDiasPagados',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: (params) => {
          return params.data.provId ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_APORTE_INDIVIDUAL,
        width: 140,
        minWidth: 140,
        field: 'provAporteIndividual',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: (params) => {
          return params.data.provId ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_APORTE_PATRONAL,
        width: 140,
        minWidth: 140,
        field: 'provAportePatronal',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: (params) => {
          return params.data.provId ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_IECE,
        width: 100,
        minWidth: 100,
        field: 'provIece',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: (params) => {
          return params.data.provId ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_SECAP,
        width: 100,
        minWidth: 100,
        field: 'provSecap',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: (params) => {
          return params.data.provId ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_XIII,
        width: 100,
        minWidth: 100,
        field: 'provXiii',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: (params) => {
          return params.data.provId ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_XIV,
        width: 100,
        minWidth: 100,
        field: 'provXiv',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: (params) => {
          return params.data.provId ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_FONDO_RESERVA,
        width: 130,
        minWidth: 130,
        field: 'provFondoReserva',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        },
        cellClass: (params) => {
          return params.data.provId ? '' : 'tr-negrita';
        }
      },
      {
        headerName: LS.TAG_CONTABLE_ROL,
        width: 190,
        minWidth: 190,
        field: 'provContableRol',
      },
      {
        headerName: LS.TAG_CONTABLE_PROVISION,
        width: 190,
        minWidth: 190,
        field: 'provContableProvision',
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
        },
        pinnedRowCellRenderer: PinnedCellComponent,
      }
    );
    if (isModal) {
      columnas.push(
        this.utilService.getSpanSelect()
      );
    }
    return columnas;
  }
}
